from typing import List, Dict, Any, Optional
from ..config import settings
from ..models.risk import RiskAssessmentResult, EvidenceItem
from ..models.validation import DocumentValidationResult
from ..models.forensic import ForensicAnalysisResult
from ..models.screening import FaceVerificationResult, WatchlistMatchResult
from ..models.document import MRZResult

class RiskEngine:
    def calculate_risk(
        self,
        validation_res: Optional[DocumentValidationResult],
        forensic_res: Optional[ForensicAnalysisResult],
        mrz_res: Optional[MRZResult],
        face_res: Optional[FaceVerificationResult],
        watchlist_res: Optional[WatchlistMatchResult]
    ) -> RiskAssessmentResult:
        evidence: List[EvidenceItem] = []
        
        # 1. Tampering Signal (35% weight)
        tampering_score = forensic_res.overall_tampering_score * 100 if forensic_res else 0.0
        if forensic_res:
            for finding in forensic_res.findings:
                if finding.score >= 0.40:
                    evidence.append(EvidenceItem(
                        title=f"{finding.detector.replace('_', ' ').title()} anomaly",
                        severity=finding.severity,
                        confidence=finding.score,
                        source="Image Forensics",
                        description=finding.explanation
                    ))

        # 2. Validation & Expiry Signal (20% weight)
        val_score = 0.0
        if validation_res:
            failed_count = validation_res.failed_checks
            total_count = max(1, validation_res.total_checks)
            val_score = min(100.0, (failed_count / total_count) * 100.0)
            
            for check in validation_res.checks:
                if not check.passed:
                    evidence.append(EvidenceItem(
                        title=f"Rule Failure: {check.rule_name.replace('_', ' ').title()}",
                        severity=check.severity,
                        confidence=0.95,
                        source="Document Validation Engine",
                        description=check.message
                    ))

        # 3. MRZ / OCR Consistency Signal (20% weight)
        mrz_score = 0.0
        if mrz_res:
            if not mrz_res.check_digits_valid:
                mrz_score += 40.0
                evidence.append(EvidenceItem(
                    title="MRZ Check Digit Mismatch",
                    severity="HIGH",
                    confidence=0.98,
                    source="ICAO MRZ Checksum Validator",
                    description="The MRZ line checksum failed ICAO Doc 9303 digit validation."
                ))
            
            for f_name, comp in mrz_res.field_comparisons.items():
                if not comp.consistent:
                    mrz_score += 35.0
                    evidence.append(EvidenceItem(
                        title=f"{f_name.replace('_', ' ').upper()} OCR/MRZ Mismatch",
                        severity="HIGH",
                        confidence=0.92,
                        source="MRZ Consistency Engine",
                        description=f"Extracted OCR value '{comp.ocr}' differs from MRZ payload '{comp.mrz}'."
                    ))

            mrz_score = min(100.0, mrz_score)

        # 4. Face Verification Signal (15% weight)
        face_score = 0.0
        if face_res and face_res.status != "UNABLE_TO_VERIFY":
            if face_res.status == "REVIEW_REQUIRED":
                face_score = (1.0 - face_res.similarity) * 100.0
                evidence.append(EvidenceItem(
                    title="Facial Feature Mismatch / Review Needed",
                    severity="HIGH" if face_res.similarity < 0.5 else "MEDIUM",
                    confidence=face_res.confidence,
                    source="Face Verification Engine",
                    description=face_res.details
                ))
            elif face_res.status == "NO_FACE_DETECTED":
                face_score = 30.0
                evidence.append(EvidenceItem(
                    title="Face Detection Warning",
                    severity="MEDIUM",
                    confidence=0.80,
                    source="Face Verification Engine",
                    description=face_res.details
                ))

        # 5. Metadata Anomaly Signal (10% weight)
        metadata_score = 0.0
        if forensic_res:
            meta_finding = next((f for f in forensic_res.findings if f.detector == "metadata_anomaly"), None)
            if meta_finding and meta_finding.score >= 0.4:
                metadata_score = meta_finding.score * 100.0
                evidence.append(EvidenceItem(
                    title="Editing Software Footprint",
                    severity=meta_finding.severity,
                    confidence=meta_finding.score,
                    source="Metadata Detector",
                    description=meta_finding.explanation
                ))

        # 6. Watchlist Bonus Match Trigger
        if watchlist_res and watchlist_res.matched:
            evidence.append(EvidenceItem(
                title="Demo Watchlist Match",
                severity="HIGH",
                confidence=0.99,
                source="Demo Watchlist Database",
                description=f"Document number '{watchlist_res.document_number}' matched synthetic demo database entry: {watchlist_res.reason}."
            ))
            # Elevate score heavily for watchlist match
            tampering_score = max(tampering_score, 80.0)

        # Weighted score calculation
        weights = {
            "tampering": settings.WEIGHT_TAMPERING,
            "validation": settings.WEIGHT_VALIDATION,
            "mrz_ocr": settings.WEIGHT_MRZ_OCR,
            "face": settings.WEIGHT_FACE,
            "metadata": settings.WEIGHT_METADATA
        }

        weighted_total = (
            tampering_score * weights["tampering"] +
            val_score * weights["validation"] +
            mrz_score * weights["mrz_ocr"] +
            face_score * weights["face"] +
            metadata_score * weights["metadata"]
        )

        risk_score = int(round(min(100.0, weighted_total)))

        # Categorize risk level
        if risk_score >= 60:
            risk_level = "HIGH"
            recommendation = "REVIEW_REQUIRED"
        elif risk_score >= 30:
            risk_level = "MEDIUM"
            recommendation = "MANUAL_VERIFICATION_RECOMMENDED"
        else:
            risk_level = "LOW"
            recommendation = "ACCEPTABLE"

        overall_conf = 0.91
        if len(evidence) > 0:
            overall_conf = float(round(sum([e.confidence for e in evidence]) / len(evidence), 2))

        return RiskAssessmentResult(
            risk_score=risk_score,
            risk_level=risk_level,
            confidence=overall_conf,
            recommendation=recommendation,
            weights_used=weights,
            signal_scores={
                "tampering": round(tampering_score, 1),
                "validation": round(val_score, 1),
                "mrz_ocr": round(mrz_score, 1),
                "face": round(face_score, 1),
                "metadata": round(metadata_score, 1)
            },
            evidence=evidence
        )

risk_engine = RiskEngine()
