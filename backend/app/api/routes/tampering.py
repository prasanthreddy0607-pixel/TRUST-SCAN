from fastapi import APIRouter, UploadFile, File
import os
from ...config import settings
from ...utils.security import sanitize_filename
from ...services.preprocessing_service import preprocessing_service
from ...services.tampering_service import tampering_service

router = APIRouter()

@router.post("/tampering")
async def analyze_tampering(document_file: UploadFile = File(...)):
    safe_name = sanitize_filename(document_file.filename)
    raw_path = os.path.join(settings.UPLOAD_DIR, f"tamp_{safe_name}")
    with open(raw_path, "wb") as f:
        f.write(await document_file.read())

    prep_path, cv_img = preprocessing_service.process_document_file(raw_path, settings.UPLOAD_DIR)
    forensic_res = tampering_service.analyze(prep_path, cv_img, [], doc_type="passport")
    return forensic_res.model_dump()
