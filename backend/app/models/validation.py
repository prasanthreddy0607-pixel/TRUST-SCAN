from pydantic import BaseModel
from typing import List, Optional

class RuleCheckResult(BaseModel):
    rule_name: str
    passed: bool
    severity: str = "MEDIUM" # LOW, MEDIUM, HIGH
    message: str
    field: Optional[str] = None

class DocumentValidationResult(BaseModel):
    document_type: str
    valid: bool
    checks: List[RuleCheckResult] = []
    total_checks: int = 0
    passed_checks: int = 0
    failed_checks: int = 0
