from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .config import settings
from .api.routes import (
    health,
    screening,
    ocr,
    validation,
    tampering,
    face,
    comparison,
    reports,
    history,
    demo
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=f"{settings.TAGLINE} — Decision-Support Platform",
    version=settings.VERSION
)

# CORS Configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(screening.router, prefix=settings.API_V1_STR, tags=["Screening"])
app.include_router(ocr.router, prefix=settings.API_V1_STR, tags=["OCR"])
app.include_router(validation.router, prefix=settings.API_V1_STR, tags=["Validation"])
app.include_router(tampering.router, prefix=settings.API_V1_STR, tags=["Tampering"])
app.include_router(face.router, prefix=settings.API_V1_STR, tags=["Face Verification"])
app.include_router(comparison.router, prefix=settings.API_V1_STR, tags=["Comparison"])
app.include_router(reports.router, prefix=settings.API_V1_STR, tags=["Reports"])
app.include_router(history.router, prefix=settings.API_V1_STR, tags=["History"])
app.include_router(demo.router, prefix=settings.API_V1_STR, tags=["Demo Mode"])

# Mount static file directories for uploads & generated PDF reports
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")
if os.path.exists(settings.REPORTS_DIR):
    app.mount("/reports_gen", StaticFiles(directory=settings.REPORTS_DIR), name="reports_gen")

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "tagline": settings.TAGLINE,
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
