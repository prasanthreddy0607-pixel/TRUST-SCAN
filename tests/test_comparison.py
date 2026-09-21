import pytest
import numpy as np
import cv2
import os
from backend.app.services.comparison_service import comparison_service

def test_document_comparison(tmp_path):
    orig_path = os.path.join(tmp_path, "orig.png")
    pres_path = os.path.join(tmp_path, "pres.png")

    orig_img = np.zeros((400, 600, 3), dtype=np.uint8) + 180
    pres_img = orig_img.copy()
    # Insert modified patch in presented
    cv2.rectangle(pres_img, (100, 100), (200, 200), (0, 0, 255), -1)

    cv2.imwrite(orig_path, orig_img)
    cv2.imwrite(pres_path, pres_img)

    res = comparison_service.compare_documents(orig_path, pres_path, str(tmp_path))
    assert res is not None
    assert res["changed_regions_count"] >= 1
    assert res["difference_score"] > 0
    assert os.path.exists(res["annotated_diff_image_url"])
