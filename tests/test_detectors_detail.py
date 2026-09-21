import pytest
import numpy as np
import cv2
import os
from backend.app.detectors.photo_detector import photo_detector
from backend.app.detectors.text_detector import text_detector
from backend.app.detectors.layout_detector import layout_detector
from backend.app.detectors.compression_detector import compression_detector
from backend.app.detectors.noise_detector import noise_detector
from backend.app.detectors.blur_detector import blur_detector
from backend.app.detectors.metadata_detector import metadata_detector
from backend.app.detectors.stamp_detector import stamp_detector
from backend.app.services.face_service import face_service

def test_photo_detector_clean(tmp_path):
    img_path = os.path.join(tmp_path, "clean.png")
    img = np.zeros((400, 600, 3), dtype=np.uint8) + 120
    cv2.imwrite(img_path, img)

    res = photo_detector.analyze(img_path, img)
    assert res["detector"] == "photo_tampering"
    assert "score" in res
    assert "severity" in res

def test_text_detector():
    img = np.zeros((400, 600, 3), dtype=np.uint8) + 200
    ocr_boxes = [
        {"bounding_box": [50, 50, 150, 30], "text": "DEMO SAMPLE"},
        {"bounding_box": [50, 100, 200, 30], "text": "PASSPORT NO 123"}
    ]
    res = text_detector.analyze(img, ocr_boxes)
    assert res["detector"] == "text_manipulation"
    assert "details" in res

def test_layout_detector():
    img = np.zeros((400, 600, 3), dtype=np.uint8) + 180
    res = layout_detector.analyze(img, "passport")
    assert res["detector"] == "layout_anomaly"
    assert res["details"]["aspect_ratio"] == 1.5

def test_compression_detector(tmp_path):
    img_path = os.path.join(tmp_path, "comp.jpg")
    img = np.zeros((400, 600, 3), dtype=np.uint8) + 180
    cv2.imwrite(img_path, img)

    res = compression_detector.analyze(img_path, img)
    assert res["detector"] == "compression_anomaly"

def test_noise_detector():
    img = np.random.randint(0, 255, (400, 600, 3), dtype=np.uint8)
    res = noise_detector.analyze(img)
    assert res["detector"] == "noise_anomaly"

def test_blur_detector():
    img = np.zeros((400, 600, 3), dtype=np.uint8) + 180
    res = blur_detector.analyze(img)
    assert res["detector"] == "blur_anomaly"

def test_metadata_detector(tmp_path):
    img_path = os.path.join(tmp_path, "meta.png")
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    cv2.imwrite(img_path, img)

    res = metadata_detector.analyze(img_path)
    assert res["detector"] == "metadata_anomaly"

def test_stamp_detector():
    img = np.zeros((400, 600, 3), dtype=np.uint8) + 200
    # Insert red stamp circle contour
    cv2.circle(img, (300, 200), 50, (0, 0, 220), -1)

    res = stamp_detector.analyze(img)
    assert res["detector"] == "stamp_analysis"
    assert res["status"] == "VERIFIED_PRESENT"

def test_face_service_no_reference():
    img = np.zeros((400, 600, 3), dtype=np.uint8) + 180
    res = face_service.verify_faces(img, reference_photo_path=None)
    assert res.status == "UNABLE_TO_VERIFY"
