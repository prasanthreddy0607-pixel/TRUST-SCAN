import pytest
from backend.app.services.risk_engine import risk_engine
from backend.app.models.validation import DocumentValidationResult, RuleCheckResult
from backend.app.models.forensic import ForensicAnalysisResult, TamperingFinding
from backend.app.models.document import MRZResult, MRZFieldComparison

def test_risk_calculation_low():
    val = DocumentValidationResult(document_type="passport", valid=True, total_checks=2, passed_checks=2, failed_checks=0)
    forensic = ForensicAnalysisResult(findings=[], overall_tampering_score=0.1, suspicious_regions_count=0)
    res = risk_engine.calculate_risk(val, forensic, None, None, None)
    
    assert res.risk_level == "LOW"
    assert res.risk_score < 30
    assert res.recommendation == "ACCEPTABLE"

def test_risk_calculation_high_tampering():
    val = DocumentValidationResult(document_type="passport", valid=False, total_checks=2, passed_checks=0, failed_checks=2)
    mrz = MRZResult(
        detected=True, check_digits_valid=False,
        field_comparisons={"date_of_birth": MRZFieldComparison(ocr="2002-04-15", mrz="2001-04-15", consistent=False)}
    )
    forensic = ForensicAnalysisResult(
        findings=[TamperingFinding(detector="photo_tampering", score=0.85, severity="HIGH", status="SUSPICIOUS", explanation="Photo anomaly.")],
        overall_tampering_score=0.85, suspicious_regions_count=1
    )
    res = risk_engine.calculate_risk(val, forensic, mrz, None, None)
    
    assert res.risk_level == "HIGH"
    assert res.risk_score >= 60
    assert res.recommendation == "REVIEW_REQUIRED"
    assert len(res.evidence) >= 1
