from fastapi import APIRouter, HTTPException, status
import os
import time
from typing import List, Dict, Any
from ...config import settings
from ...models.screening import ScreeningRecord, FaceVerificationResult, WatchlistMatchResult
from ...models.document import OCRResult, OCRField, MRZResult, MRZFieldComparison
from ...models.validation import DocumentValidationResult, RuleCheckResult
from ...models.forensic import ForensicAnalysisResult, TamperingFinding, RegionBox
from ...models.risk import RiskAssessmentResult, EvidenceItem
from ...repositories.screening_repository import screening_repo
from ...services.ai_explanation_service import ai_explanation_service
from ...services.report_service import report_service

router = APIRouter()

DEMO_SCENARIOS = [
    {
        "id": "clean_passport",
        "title": "Clean Synthetic Passport",
        "description": "Standard authentic synthetic passport with valid MRZ, unexpired dates, matching face, and clear photo region.",
        "expected_risk": "LOW (12/100)",
        "badge": "Authentic Baseline"
    },
    {
        "id": "tampered_photo_passport",
        "title": "Modified Photo Passport",
        "description": "Passport with altered facial photo region exhibiting edge discontinuity and ELA compression artifacts.",
        "expected_risk": "HIGH (72/100)",
        "badge": "Photo Tampering"
    },
    {
        "id": "dob_mismatch_passport",
        "title": "Modified DOB Passport",
        "description": "Document where visual DOB text (15 APR 2002) differs from underlying MRZ payload (15 APR 2001).",
        "expected_risk": "HIGH (68/100)",
        "badge": "MRZ Mismatch"
    },
    {
        "id": "multiple_anomaly_passport",
        "title": "Multiple Modification Passport",
        "description": "Passport with tampered photo, DOB/MRZ inconsistency, and font stroke thickness variations.",
        "expected_risk": "HIGH (88/100)",
        "badge": "Multiple Anomalies"
    },
    {
        "id": "clean_visa",
        "title": "Clean Synthetic Visa",
        "description": "Standard entry permit visa document with valid stay duration and clear official ink stamp.",
        "expected_risk": "LOW (15/100)",
        "badge": "Visa Baseline"
    },
    {
        "id": "modified_visa",
        "title": "Modified Visa Document",
        "description": "Entry visa with altered validity dates and background pixel variance around issue details.",
        "expected_risk": "MEDIUM (52/100)",
        "badge": "Field Alteration"
    },
    {
        "id": "expired_passport",
        "title": "Expired Demo Passport",
        "description": "Synthetic passport with an expiration date in the past (14 APR 2021).",
        "expected_risk": "HIGH (65/100)",
        "badge": "Expired Document"
    },
    {
        "id": "watchlist_match_passport",
        "title": "Demo Watchlist Match",
        "description": "Passport matching synthetic stolen/lost document demo database entry 'DEMO-BLOCK-001'.",
        "expected_risk": "HIGH (92/100)",
        "badge": "Watchlist Match"
    }
]

@router.get("/demo")
async def get_demo_scenarios() -> List[Dict[str, Any]]:
    return DEMO_SCENARIOS

@router.post("/demo/run/{scenario_id}", response_model=ScreeningRecord)
async def run_demo_scenario(scenario_id: str):
    found = next((s for s in DEMO_SCENARIOS if s["id"] == scenario_id), None)
    if not found:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Demo scenario '{scenario_id}' not found.")

    screening_id = f"DEMO-{scenario_id[:6].upper()}-{int(time.time()) % 1000:03d}"
    
    # Construct deterministic screening payload based on selected scenario
    if scenario_id == "clean_passport":
        rec = _build_clean_demo(screening_id)
    elif scenario_id == "tampered_photo_passport":
        rec = _build_photo_tampered_demo(screening_id)
    elif scenario_id == "dob_mismatch_passport":
        rec = _build_dob_mismatch_demo(screening_id)
    elif scenario_id == "multiple_anomaly_passport":
        rec = _build_multiple_anomaly_demo(screening_id)
    elif scenario_id == "expired_passport":
        rec = _build_expired_demo(screening_id)
    elif scenario_id == "watchlist_match_passport":
        rec = _build_watchlist_demo(screening_id)
    else:
        rec = _build_clean_demo(screening_id)

    # Generate AI explanation and PDF report
    rec.ai_summary = ai_explanation_service.generate_explanation(rec.risk_assessment, doc_type=rec.document_type)
    pdf_path = report_service.generate_pdf_report(rec)
    rec.report_pdf_url = pdf_path

    await screening_repo.save_screening(rec)
    return rec

def _build_clean_demo(sid: str) -> ScreeningRecord:
    ocr = OCRResult(
        document_type="passport",
        fields={
            "name": OCRField(value="SAMPLE PERSON", confidence=0.98),
            "passport_number": OCRField(value="DEMO-P123456", confidence=0.96),
            "date_of_birth": OCRField(value="2002-04-15", confidence=0.97),
            "expiry_date": OCRField(value="2032-04-14", confidence=0.98)
        },
        overall_confidence=0.97
    )
    mrz = MRZResult(
        detected=True,
        raw_mrz=["P<DEMOSAMPLE<<PERSON<<<<<<<<<<<<<<<<<<<<<<", "DEMO-P123456DEM8504152M3204147<<<<<<<<<<<<<<02"],
        passport_number="DEMO-P123456",
        surname="SAMPLE",
        given_names="PERSON",
        date_of_birth="2002-04-15",
        expiry_date="2032-04-14",
        check_digits_valid=True,
        field_comparisons={
            "date_of_birth": MRZFieldComparison(ocr="2002-04-15", mrz="2002-04-15", consistent=True),
            "passport_number": MRZFieldComparison(ocr="DEMO-P123456", mrz="DEMO-P123456", consistent=True)
        }
    )
    val = DocumentValidationResult(
        document_type="passport", valid=True,
        checks=[
            RuleCheckResult(rule_name="expiry_validity", passed=True, severity="LOW", message="Document active."),
            RuleCheckResult(rule_name="mrz_consistency", passed=True, severity="LOW", message="MRZ and OCR match.")
        ],
        total_checks=2, passed_checks=2, failed_checks=0
    )
    forensic = ForensicAnalysisResult(
        findings=[
            TamperingFinding(detector="photo_tampering", score=0.10, severity="LOW", status="CLEAN", explanation="Photo boundary uniform."),
            TamperingFinding(detector="text_manipulation", score=0.08, severity="LOW", status="CLEAN", explanation="Font stroke uniform.")
        ],
        overall_tampering_score=0.10, suspicious_regions_count=0
    )
    face = FaceVerificationResult(similarity=0.92, status="MATCH", confidence=0.94, detected_in_document=True, detected_in_reference=True, details="Facial match confirmed.")
    watch = WatchlistMatchResult(matched=False, document_number="DEMO-P123456", status="CLEAN", disclaimer="Demo database — not connected to government systems.")
    
    risk = RiskAssessmentResult(
        risk_score=12, risk_level="LOW", confidence=0.96, recommendation="ACCEPTABLE",
        evidence=[]
    )
    return ScreeningRecord(
        screening_id=sid, filename="demo_clean_passport.png", file_path="demo_data/clean_passport.png",
        document_type="passport", created_at=time.strftime("%Y-%m-%d %H:%M:%S"), status="COMPLETED",
        ocr_result=ocr, mrz_result=mrz, validation_result=val, forensic_result=forensic,
        face_result=face, watchlist_result=watch, risk_assessment=risk, original_image_url="demo_data/clean_passport.png"
    )

def _build_photo_tampered_demo(sid: str) -> ScreeningRecord:
    clean = _build_clean_demo(sid)
    clean.filename = "demo_tampered_photo_passport.png"
    clean.forensic_result = ForensicAnalysisResult(
        findings=[
            TamperingFinding(
                detector="photo_tampering", score=0.82, severity="HIGH", status="SUSPICIOUS",
                region=RegionBox(x=100, y=180, width=220, height=260, label="Photo Region Anomaly"),
                explanation="Photo region shows ELA compression inconsistency and boundary edge discontinuity."
            )
        ],
        overall_tampering_score=0.82, suspicious_regions_count=1
    )
    clean.risk_assessment = RiskAssessmentResult(
        risk_score=72, risk_level="HIGH", confidence=0.89, recommendation="REVIEW_REQUIRED",
        evidence=[
            EvidenceItem(title="Photo Region Anomaly", severity="HIGH", confidence=0.82, source="Image Forensics", description="Photo region shows image-level characteristics that differ from surrounding document regions.")
        ]
    )
    return clean

def _build_dob_mismatch_demo(sid: str) -> ScreeningRecord:
    clean = _build_clean_demo(sid)
    clean.filename = "demo_dob_mismatch_passport.png"
    clean.mrz_result.field_comparisons["date_of_birth"] = MRZFieldComparison(ocr="2002-04-15", mrz="2001-04-15", consistent=False)
    clean.validation_result = DocumentValidationResult(
        document_type="passport", valid=False,
        checks=[RuleCheckResult(rule_name="mrz_ocr_consistency_dob", passed=False, severity="HIGH", message="OCR DOB (2002-04-15) differs from MRZ DOB (2001-04-15).", field="date_of_birth")],
        total_checks=2, passed_checks=1, failed_checks=1
    )
    clean.risk_assessment = RiskAssessmentResult(
        risk_score=68, risk_level="HIGH", confidence=0.91, recommendation="REVIEW_REQUIRED",
        evidence=[
            EvidenceItem(title="DOB/MRZ Inconsistency", severity="HIGH", confidence=0.92, source="MRZ Consistency Engine", description="Extracted OCR date of birth (2002-04-15) differs from MRZ payload (2001-04-15).")
        ]
    )
    return clean

def _build_multiple_anomaly_demo(sid: str) -> ScreeningRecord:
    rec = _build_photo_tampered_demo(sid)
    rec.filename = "demo_multiple_anomaly_passport.png"
    rec.risk_assessment.risk_score = 88
    rec.risk_assessment.evidence.append(
        EvidenceItem(title="DOB/MRZ Inconsistency", severity="HIGH", confidence=0.92, source="MRZ Engine", description="MRZ checksum failed line 2 verification.")
    )
    return rec

def _build_expired_demo(sid: str) -> ScreeningRecord:
    rec = _build_clean_demo(sid)
    rec.filename = "demo_expired_passport.png"
    rec.ocr_result.fields["expiry_date"] = OCRField(value="2021-04-14", confidence=0.98)
    rec.validation_result = DocumentValidationResult(
        document_type="passport", valid=False,
        checks=[RuleCheckResult(rule_name="expiry_validity", passed=False, severity="HIGH", message="Document expired on 2021-04-14.", field="expiry_date")],
        total_checks=2, passed_checks=1, failed_checks=1
    )
    rec.risk_assessment = RiskAssessmentResult(
        risk_score=65, risk_level="HIGH", confidence=0.96, recommendation="REVIEW_REQUIRED",
        evidence=[EvidenceItem(title="Expired Document", severity="HIGH", confidence=0.98, source="Rule Engine", description="Document expiry date (2021-04-14) is in the past.")]
    )
    return rec

def _build_watchlist_demo(sid: str) -> ScreeningRecord:
    rec = _build_clean_demo(sid)
    rec.filename = "demo_watchlist_passport.png"
    rec.ocr_result.fields["passport_number"] = OCRField(value="DEMO-BLOCK-001", confidence=0.99)
    rec.watchlist_result = WatchlistMatchResult(
        matched=True, document_number="DEMO-BLOCK-001", status="REVIEW_REQUIRED",
        reason="Synthetic demo record — Flagged in mock list", disclaimer="Demo database — not connected to government systems."
    )
    rec.risk_assessment = RiskAssessmentResult(
        risk_score=92, risk_level="HIGH", confidence=0.99, recommendation="REVIEW_REQUIRED",
        evidence=[EvidenceItem(title="Demo Watchlist Match", severity="HIGH", confidence=0.99, source="Demo Watchlist DB", description="Document number matched synthetic demo record 'DEMO-BLOCK-001'.")]
    )
    return rec
