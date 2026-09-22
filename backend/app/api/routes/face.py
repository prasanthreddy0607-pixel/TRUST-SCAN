from fastapi import APIRouter, UploadFile, File
import os
from ...config import settings
from ...utils.security import sanitize_filename
from ...services.preprocessing_service import preprocessing_service
from ...services.face_service import face_service

router = APIRouter()

@router.post("/face/verify")
async def verify_face(
    document_file: UploadFile = File(...),
    reference_photo: UploadFile = File(...)
):
    safe_doc = sanitize_filename(document_file.filename)
    safe_ref = sanitize_filename(reference_photo.filename)

    doc_path = os.path.join(settings.UPLOAD_DIR, f"face_doc_{safe_doc}")
    ref_path = os.path.join(settings.UPLOAD_DIR, f"face_ref_{safe_ref}")

    with open(doc_path, "wb") as f:
        f.write(await document_file.read())
    with open(ref_path, "wb") as f:
        f.write(await reference_photo.read())

    prep_path, cv_img = preprocessing_service.process_document_file(doc_path, settings.UPLOAD_DIR)
    res = face_service.verify_faces(cv_img, reference_photo_path=ref_path)
    return res.model_dump()

@router.post("/face/check-liveness")
async def check_face_liveness(
    reference_photo: UploadFile = File(...)
):
    contents = await reference_photo.read()
    import cv2
    import numpy as np
    nparr = np.frombuffer(contents, np.uint8)
    cv_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if cv_img is None:
        return {"is_human": False, "confidence": 0.0, "details": "Invalid or corrupt image format.", "message": "Invalid or corrupt image format."}

    is_human, confidence, message = face_service.check_human_liveness(cv_img)
    return {
        "is_human": is_human,
        "confidence": confidence,
        "details": message,
        "message": message
    }


