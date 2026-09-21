import cv2
import numpy as np
import os
from typing import Dict, Any, List, Tuple
from ..utils.image_utils import load_image_cv, save_image_cv

class ComparisonService:
    def compare_documents(self, original_path: str, presented_path: str, output_dir: str) -> Dict[str, Any]:
        """
        Compare Original vs. Presented Document:
        1. Image alignment & normalization
        2. Absolute pixel difference & thresholding
        3. Contour grouping & changed region extraction
        4. Generate heatmap annotated image
        """
        img_orig = load_image_cv(original_path)
        img_pres = load_image_cv(presented_path)

        h1, w1 = img_orig.shape[:2]
        img_pres_resized = cv2.resize(img_pres, (w1, h1), interpolation=cv2.INTER_AREA)

        # Convert to grayscale
        g_orig = cv2.cvtColor(img_orig, cv2.COLOR_BGR2GRAY)
        g_pres = cv2.cvtColor(img_pres_resized, cv2.COLOR_BGR2GRAY)

        # Compute absolute pixel difference
        diff = cv2.absdiff(g_orig, g_pres)
        
        # Apply threshold to isolate changed pixels
        _, thresh = cv2.threshold(diff, 35, 255, cv2.THRESH_BINARY)
        
        # Morphological close to group adjacent pixel changes into bounding boxes
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 15))
        closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

        contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        changed_regions: List[Dict[str, Any]] = []
        annotated_diff = img_pres_resized.copy()
        
        total_diff_area = 0

        for idx, cnt in enumerate(contours):
            area = cv2.contourArea(cnt)
            if area > 150: # Filter small noise
                x, y, w, h = cv2.boundingRect(cnt)
                total_diff_area += area
                
                # Determine severity based on region area and location
                severity = "HIGH" if area > 2000 else ("MEDIUM" if area > 500 else "LOW")
                
                # Label heuristic (Photo area vs text area)
                if x < w1 * 0.4 and y > h1 * 0.2 and y < h1 * 0.7:
                    label = "Photo Region Modification"
                elif y > h1 * 0.6:
                    label = "MRZ / Bottom Field Change"
                else:
                    label = f"Text / Field Difference #{idx+1}"

                changed_regions.append({
                    "id": f"diff-{idx+1}",
                    "region": {"x": x, "y": y, "width": w, "height": h},
                    "severity": severity,
                    "label": label,
                    "area_pixels": float(area)
                })

                # Draw red box and yellow glow on presented image
                cv2.rectangle(annotated_diff, (x, y), (x + w, y + h), (0, 0, 230), 2)
                cv2.putText(annotated_diff, label, (x, max(15, y - 5)), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 1)

        diff_ratio = float(total_diff_area / (w1 * h1))
        diff_score = min(100, int(round(diff_ratio * 400))) # Normalize 0-100

        # Save difference map image
        diff_filename = f"diff_{os.path.basename(presented_path)}"
        diff_out_path = os.path.join(output_dir, diff_filename)
        save_image_cv(annotated_diff, diff_out_path)

        return {
            "comparison_id": f"CMP-{os.path.basename(presented_path)[:6]}",
            "difference_score": diff_score,
            "changed_regions_count": len(changed_regions),
            "changed_regions": changed_regions,
            "annotated_diff_image_url": diff_out_path,
            "original_image_url": original_path,
            "presented_image_url": presented_path
        }

comparison_service = ComparisonService()
