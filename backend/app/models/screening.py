from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

from .document import OCRResult, MRZResult
from .validation import DocumentValidationResult
from .forensic import ForensicAnalysisResult
from .risk import RiskAssessmentResult

class FaceVerificationResult(BaseModel):
    similarity: float = 0.0 # Cosine similarity (0-1)
    status: str = "UNABLE_TO_VERIFY" # MATCH, REVIEW_REQUIRED, NO_FACE_DETECTED, UNABLE_TO_VERIFY
    confidence: float = 0.0
    detected_in_document: bool = False
    detected_in_reference: bool = False
    details: str = "No reference photo supplied."

class WatchlistMatchResult(BaseModel):
    matched: bool = False
    document_number: Optional[str] = None
    status: str = "CLEAN"
    reason: Optional[str] = None
    disclaimer: str = "Demo database — not connected to government systems."

class ScreeningRecord(BaseModel):
    screening_id: str
    filename: str
    file_path: str
    document_type: str
    created_at: str
    status: str = "COMPLETED" # PROCESSING, COMPLETED, FAILED
    
    # Modules Data
    ocr_result: Optional[OCRResult] = None
    mrz_result: Optional[MRZResult] = None
    validation_result: Optional[DocumentValidationResult] = None
    forensic_result: Optional[ForensicAnalysisResult] = None
    face_result: Optional[FaceVerificationResult] = None
    watchlist_result: Optional[WatchlistMatchResult] = None
    
    # Aggregated Engine
    risk_assessment: Optional[RiskAssessmentResult] = None
    ai_summary: Optional[str] = None
    
    # Metadata & URLs
    original_image_url: str
    annotated_image_url: Optional[str] = None
    report_pdf_url: Optional[str] = None
    processing_time_ms: int = 0
