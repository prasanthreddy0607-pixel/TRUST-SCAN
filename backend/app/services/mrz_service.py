import re
from typing import Dict, Any, List, Optional
from ..models.document import MRZResult, MRZFieldComparison, OCRField

def _check_digit(data: str) -> int:
    """ICAO 9303 check digit weighting (7, 3, 1 repeating)."""
    weights = [7, 3, 1]
    total = 0
    for i, char in enumerate(data):
        if char == '<':
            val = 0
        elif char.isdigit():
            val = int(char)
        elif char.isalpha():
            val = ord(char.upper()) - 55
        else:
            val = 0
        total += val * weights[i % 3]
    return total % 10

class MRZService:
    def extract_and_parse(self, raw_ocr_lines: List[str], ocr_fields: Dict[str, OCRField]) -> MRZResult:
        """
        Locate MRZ lines (lines matching << pattern), parse document code, country, surname, given names,
        passport number, nationality, DOB, sex, expiry, and validate check digits.
        """
        mrz_lines = []
        for line in raw_ocr_lines:
            cleaned = line.strip().replace(' ', '').upper()
            if '<' in cleaned and len(cleaned) >= 28:
                mrz_lines.append(cleaned)

        if not mrz_lines or len(mrz_lines) < 2:
            # Fallback synthetic MRZ if missing
            return MRZResult(
                detected=False,
                raw_mrz=[],
                check_digits_valid=True,
                field_comparisons={}
            )

        line1 = mrz_lines[0]
        line2 = mrz_lines[1]

        # Parse TD3 (Passport) format
        doc_code = line1[0:2].replace('<', '')
        issuing_country = line1[2:5].replace('<', '')
        
        name_part = line1[5:].split('<<')
        surname = name_part[0].replace('<', ' ').strip() if len(name_part) > 0 else ""
        given_names = name_part[1].replace('<', ' ').strip() if len(name_part) > 1 else ""

        passport_num = line2[0:9].replace('<', '')
        pass_check = line2[9] if len(line2) > 9 else ""
        
        nationality = line2[10:13].replace('<', '') if len(line2) >= 13 else ""
        
        raw_dob = line2[13:19] if len(line2) >= 19 else ""
        dob_check = line2[19] if len(line2) > 19 else ""
        
        sex = line2[20] if len(line2) > 20 else "M"
        
        raw_expiry = line2[21:27] if len(line2) >= 27 else ""
        exp_check = line2[27] if len(line2) > 27 else ""

        # Format dates (YYMMDD -> YYYY-MM-DD)
        formatted_dob = self._format_mrz_date(raw_dob, is_dob=True)
        formatted_exp = self._format_mrz_date(raw_expiry, is_dob=False)

        # Check Digits Verification
        valid_pass = (pass_check.isdigit() and int(pass_check) == _check_digit(passport_num)) if pass_check else True
        valid_dob = (dob_check.isdigit() and int(dob_check) == _check_digit(raw_dob)) if dob_check else True
        valid_exp = (exp_check.isdigit() and int(exp_check) == _check_digit(raw_expiry)) if exp_check else True
        all_checks_valid = valid_pass and valid_dob and valid_exp

        # Cross-field comparisons (MRZ vs OCR)
        ocr_dob = ocr_fields.get("date_of_birth", OCRField(value="")).value
        ocr_exp = ocr_fields.get("expiry_date", OCRField(value="")).value
        ocr_pass = ocr_fields.get("passport_number", OCRField(value="")).value
        ocr_name = ocr_fields.get("name", OCRField(value="")).value

        comparisons = {
            "date_of_birth": MRZFieldComparison(
                ocr=ocr_dob,
                mrz=formatted_dob,
                consistent=(ocr_dob == formatted_dob) if ocr_dob and formatted_dob else True
            ),
            "expiry_date": MRZFieldComparison(
                ocr=ocr_exp,
                mrz=formatted_exp,
                consistent=(ocr_exp == formatted_exp) if ocr_exp and formatted_exp else True
            ),
            "passport_number": MRZFieldComparison(
                ocr=ocr_pass,
                mrz=passport_num,
                consistent=(ocr_pass == passport_num) if ocr_pass and passport_num else True
            )
        }

        return MRZResult(
            detected=True,
            raw_mrz=mrz_lines,
            document_code=doc_code,
            issuing_country=issuing_country,
            surname=surname,
            given_names=given_names,
            passport_number=passport_num,
            nationality=nationality,
            date_of_birth=formatted_dob,
            sex=sex,
            expiry_date=formatted_exp,
            check_digits_valid=all_checks_valid,
            field_comparisons=comparisons
        )

    def _format_mrz_date(self, yymmdd: str, is_dob: bool = True) -> Optional[str]:
        if len(yymmdd) != 6 or not yymmdd.isdigit():
            return None
        yy, mm, dd = int(yymmdd[0:2]), yymmdd[2:4], yymmdd[4:6]
        prefix = "19" if is_dob and yy > 25 else "20"
        return f"{prefix}{yy:02d}-{mm}-{dd}"

mrz_service = MRZService()
