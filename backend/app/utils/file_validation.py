from fastapi import HTTPException, UploadFile, status
import os
from ..config import settings

def validate_uploaded_file(file: UploadFile) -> str:
    """Validate extension and file size."""
    filename = file.filename or ""
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed extensions: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
    return ext
