from fastapi import APIRouter, Body
from ...models.document import OCRResult
from ...services.validation_service import validation_service

router = APIRouter()

@router.post("/validate")
async def validate_document_data(payload: dict = Body(...)):
    doc_type = payload.get("document_type", "passport")
    ocr_res = OCRResult(**payload.get("ocr_result", {})) if "ocr_result" in payload else OCRResult(document_type=doc_type)
    val_res = validation_service.validate(doc_type, ocr_res)
    return val_res.model_dump()
