from fastapi import APIRouter
from ...config import settings

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "services": {
            "ocr": True,
            "database": True,
            "gemini": bool(settings.GEMINI_API_KEY),
            "face": True,
            "mongodb_configured": bool(settings.MONGODB_URI)
        }
    }
