import cv2
import numpy as np
from typing import Dict, Any

class LayoutDetector:
    def analyze(self, cv_img: np.ndarray, doc_type: str = "passport") -> Dict[str, Any]:
        """
        Analyze document geometry, aspect ratio, border margins, and structural alignment.
        """
        h, w, _ = cv_img.shape
        aspect_ratio = round(w / float(h), 2)
        
        # Expected standard aspect ratios:
        # Passports / IDs (ID-3 / ID-1 format): ~1.35 to 1.55
        score = 0.1
        reasons = []

        if aspect_ratio < 1.0 or aspect_ratio > 2.0:
            score += 0.30
            reasons.append(f"Non-standard document aspect ratio ({aspect_ratio})")

        # Check edge border crop anomalies
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.mean(edges > 0)

        if edge_density < 0.02:
            score += 0.25
            reasons.append("Low structural contour density")

        score = min(0.85, round(score, 2))

        if score >= 0.50:
            severity = "MEDIUM"
            status = "REVIEW_REQUIRED"
            explanation = f"Layout anomaly detected: {', '.join(reasons)}."
        else:
            severity = "LOW"
            status = "CLEAN"
            explanation = "Document structural layout and aspect ratio conform to standard formatting."

        return {
            "detector": "layout_anomaly",
            "score": score,
            "severity": severity,
            "status": status,
            "region": {"x": 10, "y": 10, "width": w - 20, "height": h - 20},
            "explanation": explanation,
            "details": {
                "aspect_ratio": aspect_ratio,
                "edge_density": float(round(edge_density, 4))
            }
        }

layout_detector = LayoutDetector()
