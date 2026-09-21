import pytest
import numpy as np
import os
from backend.app.services.tampering_service import tampering_service

def test_tampering_analysis(tmp_path):
    img_path = os.path.join(tmp_path, "test_doc.png")
    cv_img = np.zeros((400, 600, 3), dtype=np.uint8) + 180
    import cv2
    cv2.imwrite(img_path, cv_img)

    res = tampering_service.analyze(img_path, cv_img, [], doc_type="passport")
    assert res is not None
    assert len(res.findings) == 8 # All 8 detectors executed
    assert res.overall_tampering_score >= 0.0
