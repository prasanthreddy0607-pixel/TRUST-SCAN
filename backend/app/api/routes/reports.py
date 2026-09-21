from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
import os
from ...config import settings
from ...repositories.screening_repository import screening_repo
from ...services.report_service import report_service

router = APIRouter()

@router.get("/report/{screening_id}")
async def get_report_pdf(screening_id: str):
    record = await screening_repo.get_screening(screening_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Screening '{screening_id}' not found.")

    pdf_filename = f"Report_{screening_id}.pdf"
    pdf_path = os.path.join(settings.REPORTS_DIR, pdf_filename)

    if not os.path.exists(pdf_path):
        pdf_path = report_service.generate_pdf_report(record)

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=pdf_filename
    )

@router.get("/files/{file_name:path}")
async def get_stored_file(file_name: str):
    """Serve uploaded or annotated image files safely."""
    # Check uploads directory
    target = os.path.join(settings.UPLOAD_DIR, os.path.basename(file_name))
    if not os.path.exists(target):
        target = os.path.join(settings.REPORTS_DIR, os.path.basename(file_name))
    if not os.path.exists(target):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Requested file not found.")
    
    media = "image/png" if target.endswith(".png") else ("image/jpeg" if target.endswith(".jpg") else "application/octet-stream")
    return FileResponse(target, media_type=media)
