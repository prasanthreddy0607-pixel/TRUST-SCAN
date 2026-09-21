import cv2
import numpy as np
from typing import Dict, Any

class StampDetector:
    def analyze(self, cv_img: np.ndarray) -> Dict[str, Any]:
        """
        Color segmentation for visa/border stamps (red, purple, blue ink) and contour circularity analysis.
        """
        h, w, _ = cv_img.shape
        hsv = cv2.cvtColor(cv_img, cv2.COLOR_BGR2HSV)

        # Detect red/magenta and blue stamp ink ranges in HSV
        lower_red1 = np.array([0, 70, 50])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([160, 70, 50])
        upper_red2 = np.array([180, 255, 255])
        
        mask_red = cv2.inRange(hsv, lower_red1, upper_red1) | cv2.inRange(hsv, lower_red2, upper_red2)
        
        lower_blue = np.array([100, 70, 50])
        upper_blue = np.array([140, 255, 255])
        mask_blue = cv2.inRange(hsv, lower_blue, upper_blue)

        stamp_mask = mask_red | mask_blue
        contours, _ = cv2.findContours(stamp_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        stamps_found = []
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area > 400: # Ignore noise specs
                x, y, bw, bh = cv2.boundingRect(cnt)
                perimeter = cv2.arcLength(cnt, True)
                circularity = (4 * np.pi * area) / (perimeter ** 2 + 1e-5)
                stamps_found.append({
                    "region": {"x": x, "y": y, "width": bw, "height": bh},
                    "area": float(area),
                    "circularity": float(round(circularity, 2))
                })

        if stamps_found:
            largest = max(stamps_found, key=lambda s: s["area"])
            return {
                "detector": "stamp_analysis",
                "score": 0.15,
                "severity": "LOW",
                "status": "VERIFIED_PRESENT",
                "region": largest["region"],
                "explanation": f"Detected {len(stamps_found)} official ink stamp/seal region(s) with standard color saturation.",
                "details": {"stamps_count": len(stamps_found), "stamps": stamps_found[:3]}
            }
        
        return {
            "detector": "stamp_analysis",
            "score": 0.0,
            "severity": "LOW",
            "status": "UNABLE_TO_VERIFY",
            "region": None,
            "explanation": "No distinctive colored stamp or seal contours detected in sample document image.",
            "details": {"stamps_count": 0}
        }

stamp_detector = StampDetector()
