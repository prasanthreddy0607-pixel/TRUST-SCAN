import cv2
import numpy as np
from typing import Dict, Any
from ..utils.image_utils import perform_ela

class CompressionDetector:
    def analyze(self, image_path: str, cv_img: np.ndarray) -> Dict[str, Any]:
        """
        JPEG Compression & Error Level Analysis (ELA) across document grid.
        High local variance in ELA indicates double-compression or paste-over editing.
        """
        h, w, _ = cv_img.shape
        ela_matrix = perform_ela(image_path)
        ela_gray = cv2.cvtColor(ela_matrix, cv2.COLOR_BGR2GRAY)

        # Divide into 4x4 grid and measure variance across blocks
        grid_rows, grid_cols = 4, 4
        rh, cw = h // grid_rows, w // grid_cols
        block_means = []

        max_block_val = 0
        max_block_region = {"x": 0, "y": 0, "width": cw, "height": rh}

        for r in range(grid_rows):
            for c in range(grid_cols):
                bx, by = c * cw, r * rh
                block = ela_gray[by:by+rh, bx:bx+cw]
                mean_val = float(np.mean(block))
                block_means.append(mean_val)
                if mean_val > max_block_val:
                    max_block_val = mean_val
                    max_block_region = {"x": bx, "y": by, "width": cw, "height": rh}

        mean_ela = np.mean(block_means)
        std_ela = np.std(block_means)

        # Calculate anomaly ratio
        anomaly_ratio = float(std_ela / (mean_ela + 1e-5))
        score = min(0.90, round(anomaly_ratio * 0.4, 2))

        if score >= 0.60:
            severity = "HIGH"
            status = "SUSPICIOUS"
            explanation = "Elevated JPEG compression grid variance detected. Regional ELA values suggest localized re-compression."
        elif score >= 0.35:
            severity = "MEDIUM"
            status = "REVIEW_REQUIRED"
            explanation = "Moderate ELA compression level variation across document regions."
        else:
            severity = "LOW"
            status = "CLEAN"
            explanation = "Uniform JPEG compression response across document canvas."

        return {
            "detector": "compression_anomaly",
            "score": score,
            "severity": severity,
            "status": status,
            "region": max_block_region,
            "explanation": explanation,
            "details": {
                "mean_ela": float(round(mean_ela, 2)),
                "std_ela": float(round(std_ela, 2)),
                "anomaly_ratio": float(round(anomaly_ratio, 2))
            }
        }

compression_detector = CompressionDetector()
