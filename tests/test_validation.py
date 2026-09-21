import pytest
from backend.app.services.validation_service import validation_service
from backend.app.models.document import OCRResult, OCRField

def test_passport_validation_pass():
    ocr = OCRResult(
        document_type="passport",
        fields={
            "passport_number": OCRField(value="DEMO-P123456"),
            "name": OCRField(value="SAMPLE PERSON"),
            "date_of_birth": OCRField(value="2002-04-15"),
            "expiry_date": OCRField(value="2032-04-14")
        }
    )
    val = validation_service.validate("passport", ocr)
    assert val.valid is True
    assert val.failed_checks == 0

def test_passport_expired():
    ocr = OCRResult(
        document_type="passport",
        fields={
            "passport_number": OCRField(value="DEMO-P123456"),
            "name": OCRField(value="SAMPLE PERSON"),
            "date_of_birth": OCRField(value="2002-04-15"),
            "expiry_date": OCRField(value="2020-04-14")
        }
    )
    val = validation_service.validate("passport", ocr)
    assert val.valid is False
    assert val.failed_checks >= 1
