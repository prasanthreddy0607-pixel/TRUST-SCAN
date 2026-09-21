import cv2
import numpy as np
import os
from typing import Dict, Any, List, Optional
from ..detectors.photo_detector import photo_detector
from ..detectors.text_detector import text_detector
from ..detectors.layout_detector import layout_detector
from ..detectors.compression_detector import compression_detector
from ..detectors.noise_detector import noise_detector
from ..detectors.blur_detector import blur_detector
from ..detectors.metadata_detector import metadata_detector
from ..detectors.stamp_detector import stamp_detector
from ..models.forensic import ForensicAnalysisResult, TamperingFinding, RegionBox
from ..utils.image_utils import draw_suspicious_regions, save_image_cv

class TamperingService:
    def analyze(self, image_path: str, cv_img: np.ndarray, ocr_boxes: List[Dict[str, Any]], doc_type: str = "passport") -> ForensicAnalysisResult:
        findings: List[TamperingFinding] = []
        raw_detector_outputs = []

        # 1. Photo Tampering Analysis
        photo_res = photo_detector.analyze(image_path, cv_img)
        raw_detector_outputs.append(photo_res)

        # 2. Text Manipulation Analysis
        text_res = text_detector.analyze(cv_img, ocr_boxes)
        raw_detector_outputs.append(text_res)

        # 3. Layout Anomaly Analysis
        layout_res = layout_detector.analyze(cv_img, doc_type)
        raw_detector_outputs.append(layout_res)

        # 4. Compression Grid / ELA Analysis
        comp_res = compression_detector.analyze(image_path, cv_img)
        raw_detector_outputs.append(comp_res)

        # 5. Noise Variance Analysis
        noise_res = noise_detector.analyze(cv_img)
        raw_detector_outputs.append(noise_res)

        # 6. Blur / Sharpness Patch Analysis
        blur_res = blur_detector.analyze(cv_img)
        raw_detector_outputs.append(blur_res)

        # 7. Metadata / EXIF / Container Analysis
        meta_res = metadata_detector.analyze(image_path)
        raw_detector_outputs.append(meta_res)

        # 8. Stamp / Seal Analysis
        stamp_res = stamp_detector.analyze(cv_img)
        raw_detector_outputs.append(stamp_res)

        # Convert raw detector dicts into TamperingFinding models
        suspicious_items_for_annotation = []
        scores = []

        for item in raw_detector_outputs:
            sc = item.get("score", 0.0)
            scores.append(sc)
            reg_dict = item.get("region")
            reg_obj = RegionBox(**reg_dict) if reg_dict else None
            
            finding = TamperingFinding(
                detector=item.get("detector", "unknown"),
                score=sc,
                severity=item.get("severity", "LOW"),
                status=item.get("status", "CLEAN"),
                region=reg_obj,
                explanation=item.get("explanation", ""),
                details=item.get("details", {})
            )
            findings.append(finding)

            if sc >= 0.35 and reg_dict:
                suspicious_items_for_annotation.append({
                    "region": reg_dict,
                    "severity": item.get("severity", "MEDIUM"),
                    "detector": item.get("detector", "Anomaly")
                })

        overall_score = float(max(scores)) if scores else 0.0

        # Draw annotated image with bounding box overlays
        annotated_cv = draw_suspicious_regions(cv_img, suspicious_items_for_annotation)
        annotated_path = image_path.replace("_prep.png", "_annotated.png").replace(".png", "_annotated.png")
        save_image_cv(annotated_cv, annotated_path)

        return ForensicAnalysisResult(
            findings=findings,
            overall_tampering_score=overall_score,
            suspicious_regions_count=len(suspicious_items_for_annotation),
            annotated_image_url=annotated_path
        )

tampering_service = TamperingService()
