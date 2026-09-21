from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class RegionBox(BaseModel):
    x: int
    y: int
    width: int
    height: int
    label: Optional[str] = "Suspicious Region"

class TamperingFinding(BaseModel):
    detector: str
    score: float  # 0.0 to 1.0 (higher = higher anomaly/risk)
    severity: str  # LOW, MEDIUM, HIGH
    status: str  # CLEAN, SUSPICIOUS, REVIEW_REQUIRED, UNABLE_TO_VERIFY
    region: Optional[RegionBox] = None
    explanation: str
    details: Dict[str, Any] = {}

class ForensicAnalysisResult(BaseModel):
    findings: List[TamperingFinding] = []
    overall_tampering_score: float = 0.0
    suspicious_regions_count: int = 0
    annotated_image_url: Optional[str] = None
