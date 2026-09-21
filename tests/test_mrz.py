import pytest
from backend.app.services.mrz_service import mrz_service, _check_digit
from backend.app.models.document import OCRField

def test_mrz_check_digit():
    assert _check_digit("850415") == 7

def test_mrz_parsing_and_consistency():
    mrz_lines = [
        "P<DEMSAMPLE<<PERSON<<<<<<<<<<<<<<<<<<<<<<",
        "DEMOP12342DEM8504152M3204147<<<<<<<<<<<<<<02"
    ]
    ocr_fields = {
        "date_of_birth": OCRField(value="1985-04-15", confidence=0.98),
        "passport_number": OCRField(value="DEMOP1234", confidence=0.96)
    }

    res = mrz_service.extract_and_parse(mrz_lines, ocr_fields)
    assert res.detected is True
    assert res.surname == "SAMPLE"
    assert res.given_names == "PERSON"
    assert res.passport_number == "DEMOP1234"
    assert res.field_comparisons["date_of_birth"].consistent is True
