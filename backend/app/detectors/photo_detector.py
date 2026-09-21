import cv2
import numpy as np
from typing import Dict, Any, Optional
from ..utils.image_utils import perform_ela

class PhotoDetector:
    def analyze(self, image_path: str, cv_img: np.ndarray) -> Dict[str, Any]:
        """
        Detect photo region and check for tampering signals:
        - boundary discontinuities around photo region
        - local noise disparity between photo and rest of document
        - local ELA anomaly score
        """
        h, w, _ = cv_img.shape
        
        # Heuristic photo region: left-upper area of standard identity docs
        # Approx 15% to 45% width, 20% to 70% height
        px_x = int(w * 0.08)
        px_y = int(h * 0.18)
        px_w = int(w * 0.32)
        px_h = int(h * 0.52)
        
        # Attempt OpenCV Haar Cascade / DNN face detection for tighter bounding box
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        face_cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        if cv2.os.path.exists(face_cascade_path):
            cascade = cv2.CascadeClassifier(face_cascade_path)
            faces = cascade.detectMultiScale(gray, 1.1, 4)
            if len(faces) > 0:
                fx, fy, fw, fh = faces[0]
                # Expand box slightly to cover photo frame
                px_x = max(0, fx - int(fw * 0.2))
                px_y = max(0, fy - int(fh * 0.2))
                px_w = min(w - px_x, int(fw * 1.4))
                px_h = min(h - px_y, int(fh * 1.4))

        photo_roi = cv_img[px_y:px_y+px_h, px_x:px_x+px_w]
        if photo_roi.size == 0:
            return {
                "detector": "photo_tampering",
                "score": 0.0,
                "severity": "LOW",
                "status": "CLEAN",
                "region": {"x": px_x, "y": px_y, "width": px_w, "height": px_h},
                "explanation": "No clear photo boundary anomaly detected."
            }

        # Analyze local noise vs document noise
        roi_gray = gray[px_y:px_y+px_h, px_x:px_x+px_w]
        doc_std = np.std(gray)
        roi_std = np.std(roi_gray)
        std_diff = abs(doc_std - roi_std)

        # Analyze Laplacian edge intensity around photo boundary
        boundary_mask = np.zeros_like(gray)
        cv2.rectangle(boundary_mask, (px_x, px_y), (px_x+px_w, px_y+px_h), 255, 3)
        boundary_pixels = cv2.Laplacian(gray, cv2.CV_64F)[boundary_mask == 255]
        boundary_energy = np.mean(np.abs(boundary_pixels)) if len(boundary_pixels) > 0 else 0

        # ELA analysis score for ROI
        ela_img = perform_ela(image_path)
        ela_roi = ela_img[px_y:px_y+px_h, px_x:px_x+px_w]
        ela_score = float(np.mean(ela_roi) / 255.0)

        # Risk scoring heuristic
        score = 0.15
        if std_diff > 18:
            score += 0.35
        if boundary_energy > 45:
            score += 0.25
        if ela_score > 0.40:
            score += 0.25

        score = min(0.95, round(score, 2))

        if score >= 0.65:
            severity = "HIGH"
            status = "SUSPICIOUS"
            explanation = "Photo region exhibits elevated noise disparity, edge discontinuity, and ELA artifacts suggesting potential photo alteration or replacement."
        elif score >= 0.35:
            severity = "MEDIUM"
            status = "REVIEW_REQUIRED"
            explanation = "Subtle lighting or edge inconsistencies detected around photo boundary. Manual verification recommended."
        else:
            severity = "LOW"
            status = "CLEAN"
            explanation = "Photo region shows normal edge continuity and noise distribution."

        return {
            "detector": "photo_tampering",
            "score": score,
            "severity": severity,
            "status": status,
            "region": {"x": px_x, "y": px_y, "width": px_w, "height": px_h},
            "explanation": explanation,
            "details": {
                "std_diff": float(round(std_diff, 2)),
                "boundary_energy": float(round(boundary_energy, 2)),
                "ela_score": ela_score
            }
        }

photo_detector = PhotoDetector()
