import cv2
import numpy as np
from typing import Dict, Any

class NoiseDetector:
    def analyze(self, cv_img: np.ndarray) -> Dict[str, Any]:
        """
        Analyze spatial noise variance across document sections.
        Inconsistent noise profiles point to composited image elements.
        """
        h, w, _ = cv_img.shape
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)

        # High-pass filter to isolate noise pattern
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        noise = cv2.absdiff(gray, blur)

        # Divide into 3x3 regions
        r_h, r_w = h // 3, w // 3
        stds = []
        max_noise_region = {"x": 0, "y": 0, "width": r_w, "height": r_h}
        max_std = 0

        for r in range(3):
            for c in range(3):
                bx, by = c * r_w, r * r_h
                patch = noise[by:by+r_h, bx:bx+r_w]
                val = float(np.std(patch))
                stds.append(val)
                if val > max_std:
                    max_std = val
                    max_noise_region = {"x": bx, "y": by, "width": r_w, "height": r_h}

        mean_noise_std = np.mean(stds)
        variance_of_stds = np.std(stds)
        noise_disparity = float(variance_of_stds / (mean_noise_std + 1e-5))

        score = min(0.85, round(noise_disparity * 0.35, 2))

        if score >= 0.55:
            severity = "HIGH"
            status = "SUSPICIOUS"
            explanation = "Spatial noise profile varies significantly across document sections."
        elif score >= 0.30:
            severity = "MEDIUM"
            status = "REVIEW_REQUIRED"
            explanation = "Minor noise density variation observed between document background and data fields."
        else:
            severity = "LOW"
            status = "CLEAN"
            explanation = "Consistent high-frequency noise profile throughout image."

        return {
            "detector": "noise_anomaly",
            "score": score,
            "severity": severity,
            "status": status,
            "region": max_noise_region,
            "explanation": explanation,
            "details": {
                "noise_disparity": float(round(noise_disparity, 2)),
                "mean_noise_std": float(round(mean_noise_std, 2))
            }
        }

noise_detector = NoiseDetector()
