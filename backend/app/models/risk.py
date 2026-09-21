from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class EvidenceItem(BaseModel):
    title: str
    severity: str # LOW, MEDIUM, HIGH
    confidence: float # 0.0 to 1.0
    source: str # e.g. "MRZ validation", "Image forensics", "Face verification"
    description: str

class RiskAssessmentResult(BaseModel):
    risk_score: int # 0 to 100
    risk_level: str # LOW (0-29), MEDIUM (30-59), HIGH (60-100)
    confidence: float # Overall analysis confidence (0.0 - 1.0)
    recommendation: str # ACCEPTABLE, REVIEW_REQUIRED, MANUAL_VERIFICATION_RECOMMENDED
    weights_used: Dict[str, float] = {}
    signal_scores: Dict[str, float] = {} # Normalized 0-100 scores
    evidence: List[EvidenceItem] = []
