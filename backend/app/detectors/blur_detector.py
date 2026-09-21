import cv2
import numpy as np
from typing import Dict, Any

class BlurDetector:
    def analyze(self, cv_img: np.ndarray) -> Dict[str, Any]:
        """
        Analyze Laplacian variance to identify overall document blur or regional patch blurring.
        """
        h, w, _ = cv_img.shape
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        
        overall_var = cv2.Laplacian(gray, cv2.CV_64F).var()

        # Check for localized blur patches (e.g. blurred DOB or text override)
        r_h, r_w = h // 4, w // 4
        blur_scores = []
        min_var = overall_var
        min_region = {"x": 0, "y": 0, "width": r_w, "height": r_h}

        for r in range(4):
            for c in range(4):
                bx, by = c * r_w, r * r_h
                patch = gray[by:by+r_h, bx:bx+r_w]
                var = float(cv2.Laplacian(patch, cv2.CV_64F).var())
                blur_scores.append(var)
                if var < min_var:
                    min_var = var
                    min_region = {"x": bx, "y": by, "width": r_w, "height": r_h}

        # If overall document is extremely blurry (< 60), flag poor quality
        score = 0.1
        if overall_var < 60:
            score = 0.65
            explanation = "Document image is overall out of focus or blurred, reducing screening accuracy."
            severity = "HIGH"
            status = "REVIEW_REQUIRED"
        elif (max(blur_scores) / (min_var + 1e-5)) > 15.0 and min_var < 30:
            score = 0.55
            explanation = "Localized blur patch detected over document field. Possible redaction or text smoothing."
            severity = "MEDIUM"
            status = "SUSPICIOUS"
        else:
            explanation = "Image focus and sharpness are clear across all regions."
            severity = "LOW"
            status = "CLEAN"

        return {
            "detector": "blur_anomaly",
            "score": score,
            "severity": severity,
            "status": status,
            "region": min_region,
            "explanation": explanation,
            "details": {
                "overall_laplacian_var": float(round(overall_var, 2)),
                "min_patch_var": float(round(min_var, 2))
            }
        }

blur_detector = BlurDetector()
