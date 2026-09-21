import pytest
import numpy as np
from backend.app.services.ocr_service import ocr_service

def test_ocr_extraction():
    # Create synthetic canvas with mock dimensions
    cv_img = np.zeros((500, 800, 3), dtype=np.uint8) + 200
    res = ocr_service.extract(cv_img, doc_type="passport")
    
    assert res is not None
    assert res.document_type == "passport"
    assert "name" in res.fields
    assert "passport_number" in res.fields
    assert res.overall_confidence > 0.5
