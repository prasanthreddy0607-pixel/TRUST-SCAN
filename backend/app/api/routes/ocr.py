from fastapi import APIRouter, UploadFile, File, Form
import os
from ...config import settings
from ...utils.security import sanitize_filename
from ...services.preprocessing_service import preprocessing_service
from ...services.ocr_service import ocr_service

router = APIRouter()

@router.post("/ocr")
async def process_ocr(
    document_file: UploadFile = File(...),
    document_type: str = Form("passport")
):
    safe_name = sanitize_filename(document_file.filename)
    raw_path = os.path.join(settings.UPLOAD_DIR, f"ocr_{safe_name}")
    with open(raw_path, "wb") as f:
        f.write(await document_file.read())

    prep_path, cv_img = preprocessing_service.process_document_file(raw_path, settings.UPLOAD_DIR)
    ocr_res = ocr_service.extract(cv_img, doc_type=document_type)
    return ocr_res.model_dump()
