from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List

class OCRField(BaseModel):
    value: str
    confidence: float = 1.0
    bounding_box: Optional[List[int]] = None # [x, y, w, h]

class OCRResult(BaseModel):
    document_type: str
    fields: Dict[str, OCRField] = {}
    raw_ocr: List[Dict[str, Any]] = []
    overall_confidence: float = 0.95

class MRZFieldComparison(BaseModel):
    ocr: Optional[str] = None
    mrz: Optional[str] = None
    consistent: bool = True

class MRZResult(BaseModel):
    detected: bool = False
    raw_mrz: List[str] = []
    document_code: Optional[str] = None
    issuing_country: Optional[str] = None
    surname: Optional[str] = None
    given_names: Optional[str] = None
    passport_number: Optional[str] = None
    nationality: Optional[str] = None
    date_of_birth: Optional[str] = None
    sex: Optional[str] = None
    expiry_date: Optional[str] = None
    check_digits_valid: bool = True
    field_comparisons: Dict[str, MRZFieldComparison] = {}
