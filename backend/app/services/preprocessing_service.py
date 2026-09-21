import cv2
import numpy as np
from PIL import Image
import os
from typing import Tuple
from ..utils.pdf_utils import is_pdf, convert_pdf_to_images
from ..utils.image_utils import load_image_cv, save_image_cv, cv_to_pil, pil_to_cv

class PreprocessingService:
    def process_document_file(self, file_path: str, target_dir: str) -> Tuple[str, np.ndarray]:
        """
        Takes raw upload file path (PDF or Image), converts PDF to PNG if needed,
        applies deskew and image enhancement, saves preprocessed image and returns path + CV matrix.
        """
        if is_pdf(file_path):
            images = convert_pdf_to_images(file_path, max_pages=1)
            if not images:
                raise ValueError("Failed to render pages from PDF file.")
            cv_img = pil_to_cv(images[0])
            base_name = os.path.basename(file_path).rsplit('.', 1)[0]
            out_path = os.path.join(target_dir, f"{base_name}_prep.png")
        else:
            cv_img = load_image_cv(file_path)
            base_name = os.path.basename(file_path).rsplit('.', 1)[0]
            out_path = os.path.join(target_dir, f"{base_name}_prep.png")

        # Normalize resolution if extremely huge or small
        h, w, _ = cv_img.shape
        max_dim = 2000
        if max(h, w) > max_dim:
            scale = max_dim / float(max(h, w))
            cv_img = cv2.resize(cv_img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

        # Deskew rotation correction
        cv_img = self.deskew(cv_img)

        # Save preprocessed output
        save_image_cv(cv_img, out_path)
        return out_path, cv_img

    def deskew(self, img: np.ndarray) -> np.ndarray:
        """Correct small orientation tilt (up to +- 15 deg)."""
        try:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            blur = cv2.GaussianBlur(gray, (5, 5), 0)
            edges = cv2.Canny(blur, 50, 150)
            lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=100, minLineLength=100, maxLineGap=10)

            if lines is not None:
                angles = []
                for line in lines:
                    x1, y1, x2, y2 = line[0]
                    angle = np.degrees(np.arctan2(y2 - y1, x2 - x1))
                    if -15 < angle < 15:
                        angles.append(angle)
                
                if angles:
                    median_angle = float(np.median(angles))
                    if abs(median_angle) > 0.5:
                        h, w = img.shape[:2]
                        center = (w // 2, h // 2)
                        M = cv2.getRotationMatrix2D(center, median_angle, 1.0)
                        rotated = cv2.warpAffine(img, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
                        return rotated
        except Exception as e:
            print(f"Deskew warning: {e}")
        return img

preprocessing_service = PreprocessingService()
