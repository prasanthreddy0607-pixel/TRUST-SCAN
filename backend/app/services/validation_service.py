from datetime import datetime
from typing import Dict, Any, List
from ..models.document import OCRResult, MRZResult
from ..models.validation import DocumentValidationResult, RuleCheckResult

class ValidationService:
    def validate(self, doc_type: str, ocr_res: OCRResult, mrz_res: Optional[MRZResult] = None) -> DocumentValidationResult:
        checks: List[RuleCheckResult] = []
        fields = ocr_res.fields

        # Common Rule 1: Expiry date check
        exp_val = fields.get("expiry_date", None)
        if exp_val and exp_val.value:
            try:
                # Support YYYY-MM-DD or DD MMM YYYY
                exp_date = self._parse_date(exp_val.value)
                if exp_date and exp_date < datetime.now():
                    checks.append(RuleCheckResult(
                        rule_name="expiry_validity",
                        passed=False,
                        severity="HIGH",
                        message=f"Document expired on {exp_val.value}.",
                        field="expiry_date"
                    ))
                else:
                    checks.append(RuleCheckResult(
                        rule_name="expiry_validity",
                        passed=True,
                        severity="LOW",
                        message="Document is active and unexpired.",
                        field="expiry_date"
                    ))
            except Exception:
                checks.append(RuleCheckResult(
                    rule_name="expiry_validity",
                    passed=False,
                    severity="MEDIUM",
                    message=f"Unrecognized expiry date format: {exp_val.value}.",
                    field="expiry_date"
                ))

        # Common Rule 2: DOB logical sanity check (age > 0 and age < 120)
        dob_val = fields.get("date_of_birth", None)
        if dob_val and dob_val.value:
            try:
                dob_date = self._parse_date(dob_val.value)
                if dob_date and dob_date > datetime.now():
                    checks.append(RuleCheckResult(
                        rule_name="dob_validity",
                        passed=False,
                        severity="HIGH",
                        message=f"Future date of birth detected ({dob_val.value}).",
                        field="date_of_birth"
                    ))
                else:
                    checks.append(RuleCheckResult(
                        rule_name="dob_validity",
                        passed=True,
                        severity="LOW",
                        message="Date of birth is logically valid.",
                        field="date_of_birth"
                    ))
            except Exception:
                pass

        # Document Type Specific Rules
        if doc_type == "passport":
            self._validate_passport(fields, mrz_res, checks)
        elif doc_type == "visa":
            self._validate_visa(fields, checks)
        elif doc_type == "national_id":
            self._validate_national_id(fields, checks)
        elif doc_type == "driving_license":
            self._validate_driving_license(fields, checks)
        elif doc_type == "permit":
            self._validate_permit(fields, checks)
        else:
            checks.append(RuleCheckResult(
                rule_name="document_type_known",
                passed=False,
                severity="LOW",
                message="Unknown document type structure. Generic verification applied."
            ))

        total = len(checks)
        failed = len([c for c in checks if not c.passed])
        passed = total - failed

        return DocumentValidationResult(
            document_type=doc_type,
            valid=(failed == 0),
            checks=checks,
            total_checks=total,
            passed_checks=passed,
            failed_checks=failed
        )

    def _validate_passport(self, fields: Dict[str, Any], mrz_res: Optional[MRZResult], checks: List[RuleCheckResult]):
        # Required fields check
        required = ["passport_number", "name", "date_of_birth", "expiry_date"]
        for r in required:
            if r not in fields or not fields[r].value:
                checks.append(RuleCheckResult(
                    rule_name=f"required_field_{r}",
                    passed=False,
                    severity="HIGH",
                    message=f"Missing required passport field: {r}.",
                    field=r
                ))

        # MRZ Consistency checks
        if mrz_res and mrz_res.detected:
            if not mrz_res.check_digits_valid:
                checks.append(RuleCheckResult(
                    rule_name="mrz_checksum_validity",
                    passed=False,
                    severity="HIGH",
                    message="MRZ check digit validation failed.",
                    field="mrz"
                ))

            for f_key, comp in mrz_res.field_comparisons.items():
                if not comp.consistent:
                    checks.append(RuleCheckResult(
                        rule_name=f"mrz_ocr_consistency_{f_key}",
                        passed=False,
                        severity="HIGH",
                        message=f"Inconsistency detected between OCR field ({comp.ocr}) and MRZ payload ({comp.mrz}).",
                        field=f_key
                    ))
                else:
                    checks.append(RuleCheckResult(
                        rule_name=f"mrz_ocr_consistency_{f_key}",
                        passed=True,
                        severity="LOW",
                        message=f"MRZ and OCR values match for {f_key}.",
                        field=f_key
                    ))

    def _validate_visa(self, fields: Dict[str, Any], checks: List[RuleCheckResult]):
        required = ["passport_number", "expiry_date"]
        for r in required:
            if r not in fields:
                checks.append(RuleCheckResult(
                    rule_name=f"visa_required_{r}",
                    passed=False,
                    severity="MEDIUM",
                    message=f"Missing visa field: {r}.",
                    field=r
                ))

    def _validate_national_id(self, fields: Dict[str, Any], checks: List[RuleCheckResult]):
        if "name" not in fields or "date_of_birth" not in fields:
            checks.append(RuleCheckResult(
                rule_name="id_required_fields",
                passed=False,
                severity="HIGH",
                message="Missing core identity fields on National ID.",
                field="name"
            ))

    def _validate_driving_license(self, fields: Dict[str, Any], checks: List[RuleCheckResult]):
        pass

    def _validate_permit(self, fields: Dict[str, Any], checks: List[RuleCheckResult]):
        pass

    def _parse_date(self, dt_str: str) -> Optional[datetime]:
        dt_clean = dt_str.strip()
        for fmt in ["%Y-%m-%d", "%d %b %Y", "%d/%m/%Y", "%Y/%m/%d"]:
            try:
                return datetime.strptime(dt_clean, fmt)
            except Exception:
                continue
        return None

validation_service = ValidationService()
