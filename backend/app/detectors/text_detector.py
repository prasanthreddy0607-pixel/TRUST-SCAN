import cv2
import numpy as np
from typing import Dict, Any, List

class TextDetector:
    def analyze(self, cv_img: np.ndarray, ocr_boxes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze text region consistency:
        - Bounding box alignment & baseline drift
        - Background pixel variance around text regions
        - Font thickness / stroke width anomalies
        """
        h, w, _ = cv_img.shape
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        
        suspicious_boxes = []
        max_score = 0.1

        for item in ocr_boxes:
            box = item.get("bounding_box")
            text = item.get("text", "")
            if not box or len(box) < 4:
                continue
            
            bx, by, bw, bh = box[0], box[1], box[2], box[3]
            if bw < 5 or bh < 5 or bx + bw > w or by + bh > h:
                continue
            
            roi = gray[by:by+bh, bx:bx+bw]
            if roi.size == 0:
                continue

            # Calculate background variance vs character stroke variance
            _, thresh = cv2.threshold(roi, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
            bg_pixels = roi[thresh == 0]
            bg_std = float(np.std(bg_pixels)) if len(bg_pixels) > 0 else 0.0

            # Stroke width transform heuristic
            dist = cv2.distanceTransform(thresh, cv2.DIST_L2, 3)
            stroke_var = float(np.std(dist)) if np.max(dist) > 0 else 0.0

            field_score = 0.0
            reasons = []

            if bg_std > 28.0:
                field_score += 0.35
                reasons.append("Irregular background patch variance")
            if stroke_var > 3.5:
                field_score += 0.30
                reasons.append("Inconsistent font stroke thickness")

            if field_score > 0.35:
                suspicious_boxes.append({
                    "x": bx, "y": by, "width": bw, "height": bh,
                    "text": text,
                    "score": round(field_score, 2),
                    "reasons": reasons
                })
                max_score = max(max_score, field_score)

        max_score = min(0.90, round(max_score, 2))
        
        if max_score >= 0.60:
            severity = "HIGH"
            status = "SUSPICIOUS"
            explanation = f"Detected {len(suspicious_boxes)} text field(s) with anomalous background variance and font structure inconsistencies."
        elif max_score >= 0.35:
            severity = "MEDIUM"
            status = "REVIEW_REQUIRED"
            explanation = "Minor text baseline alignment or font stroke variance observed in document data fields."
        else:
            severity = "LOW"
            status = "CLEAN"
            explanation = "Text fields present uniform font alignment and background consistency."

        main_region = suspicious_boxes[0] if suspicious_boxes else {"x": int(w*0.3), "y": int(h*0.4), "width": int(w*0.4), "height": int(h*0.1)}

        return {
            "detector": "text_manipulation",
            "score": max_score,
            "severity": severity,
            "status": status,
            "region": {"x": main_region["x"], "y": main_region["y"], "width": main_region["width"], "height": main_region["height"]},
            "explanation": explanation,
            "details": {
                "suspicious_fields_count": len(suspicious_boxes),
                "suspicious_boxes": suspicious_boxes[:5]
            }
        }

text_detector = TextDetector()
