from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, BackgroundTasks
import os
import time
from typing import Optional
from ...config import settings
from ...utils.security import sanitize_filename, generate_unique_id
from ...utils.file_validation import validate_uploaded_file
from ...services.preprocessing_service import preprocessing_service
from ...services.document_classifier import document_classifier
from ...services.ocr_service import ocr_service
from ...services.mrz_service import mrz_service
from ...services.validation_service import validation_service
from ...services.tampering_service import tampering_service
from ...services.face_service import face_service
from ...services.watchlist_service import watchlist_service
from ...services.risk_engine import risk_engine
from ...services.ai_explanation_service import ai_explanation_service
from ...services.report_service import report_service
from ...repositories.screening_repository import screening_repo
from ...models.screening import ScreeningRecord

router = APIRouter()

@router.post("/screen", response_model=ScreeningRecord)
async def create_screening(
    document_file: UploadFile = File(...),
    reference_photo: Optional[UploadFile] = File(None),
    document_type_hint: Optional[str] = Form(None)
):
    start_time = time.time()
    
    # Validate extension
    ext = validate_uploaded_file(document_file)
    safe_name = sanitize_filename(document_file.filename)
    screening_id = generate_unique_id()
    
    # Save uploaded document to storage
    raw_path = os.path.join(settings.UPLOAD_DIR, f"{screening_id}_{safe_name}")
    with open(raw_path, "wb") as f:
        content = await document_file.read()
        f.write(content)

    # Save reference photo if provided
    ref_path = None
    if reference_photo:
        ref_ext = validate_uploaded_file(reference_photo)
        ref_name = sanitize_filename(reference_photo.filename)
        ref_path = os.path.join(settings.UPLOAD_DIR, f"{screening_id}_ref_{ref_name}")
        with open(ref_path, "wb") as f:
            f.write(await reference_photo.read())

    # PIPELINE EXECUTION
    # 1. Preprocessing
    prep_path, cv_img = preprocessing_service.process_document_file(raw_path, settings.UPLOAD_DIR)

    # 2. OCR Extraction
    # Quick initial heuristic for text lines
    ocr_res = ocr_service.extract(cv_img, doc_type="passport")
    ocr_lines = [item["text"] for item in ocr_res.raw_ocr]

    # 3. Document Classification
    classified_type = document_classifier.classify(ocr_lines, user_override=document_type_hint)
    ocr_res.document_type = classified_type

    # 4. MRZ Processing
    mrz_res = mrz_service.extract_and_parse(ocr_lines, ocr_res.fields)

    # 5. Rule Validation
    val_res = validation_service.validate(classified_type, ocr_res, mrz_res)

    # 6. Forensic Tampering Analysis
    forensic_res = tampering_service.analyze(prep_path, cv_img, ocr_res.raw_ocr, doc_type=classified_type)

    # 7. Face Verification
    face_res = face_service.verify_faces(cv_img, reference_photo_path=ref_path)

    # 8. Watchlist Database Check
    doc_number = ocr_res.fields.get("passport_number").value if "passport_number" in ocr_res.fields else None
    watchlist_res = watchlist_service.check_watchlist(doc_number)

    # 9. Risk & Evidence Engine
    risk_res = risk_engine.calculate_risk(val_res, forensic_res, mrz_res, face_res, watchlist_res)

    # 10. AI Summary & Explanation
    ai_summary = ai_explanation_service.generate_explanation(risk_res, doc_type=classified_type)

    processing_ms = int((time.time() - start_time) * 1000)

    # Build ScreeningRecord
    record = ScreeningRecord(
        screening_id=screening_id,
        filename=safe_name,
        file_path=prep_path,
        document_type=classified_type,
        created_at=time.strftime("%Y-%m-%d %H:%M:%S"),
        status="COMPLETED",
        ocr_result=ocr_res,
        mrz_result=mrz_res,
        validation_result=val_res,
        forensic_result=forensic_res,
        face_result=face_res,
        watchlist_result=watchlist_res,
        risk_assessment=risk_res,
        ai_summary=ai_summary,
        original_image_url=prep_path,
        annotated_image_url=forensic_res.annotated_image_url,
        processing_time_ms=processing_ms
    )

    # Generate PDF report automatically
    pdf_path = report_service.generate_pdf_report(record)
    record.report_pdf_url = pdf_path

    # Save to Repository
    await screening_repo.save_screening(record)

    return record

@router.get("/screen/{screening_id}", response_model=ScreeningRecord)
async def get_screening(screening_id: str):
    record = await screening_repo.get_screening(screening_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Screening '{screening_id}' not found.")
    return record

@router.delete("/screen/{screening_id}")
async def delete_screening(screening_id: str):
    success = await screening_repo.delete_screening(screening_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Screening '{screening_id}' not found.")
    return {"message": f"Screening '{screening_id}' deleted successfully."}
