import cv2
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
import io
import os
from typing import Tuple, Dict, Any, List

def load_image_cv(image_path: str) -> np.ndarray:
    """Load image safely into OpenCV BGR matrix."""
    img = cv2.imread(image_path)
    if img is None:
        # Fallback using PIL in case OpenCV imread fails on Unicode or exotic format
        pil_img = Image.open(image_path).convert("RGB")
        img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    return img

def save_image_cv(img: np.ndarray, output_path: str) -> bool:
    """Save OpenCV image matrix."""
    return cv2.imwrite(output_path, img)

def pil_to_cv(pil_image: Image.Image) -> np.ndarray:
    """Convert PIL image to OpenCV BGR matrix."""
    rgb = np.array(pil_image.convert("RGB"))
    return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)

def cv_to_pil(cv_img: np.ndarray) -> Image.Image:
    """Convert OpenCV BGR matrix to PIL Image."""
    rgb = cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB)
    return Image.fromarray(rgb)

def perform_ela(image_path: str, quality: int = 90, scale: int = 15) -> np.ndarray:
    """
    Error Level Analysis (ELA).
    Resaves image at a set JPEG quality and measures difference with original.
    Regions with higher compression error difference indicate potential tampering.
    """
    original = Image.open(image_path).convert("RGB")
    
    # Save transient JPEG in memory
    buffer = io.BytesIO()
    original.save(buffer, 'JPEG', quality=quality)
    buffer.seek(0)
    compressed = Image.open(buffer)

    # Calculate absolute difference
    diff = ImageChops.difference(original, compressed)
    
    # Enhance scale to emphasize differences
    extrema = diff.getextrema()
    max_diff = max([ex[1] for ex in extrema])
    if max_diff == 0:
        max_diff = 1
    
    scale_factor = 255.0 / max_diff
    ela_image = ImageEnhance.Brightness(diff).enhance(scale_factor)
    return pil_to_cv(ela_image)

def draw_suspicious_regions(img: np.ndarray, regions: List[Dict[str, Any]]) -> np.ndarray:
    """
    Draw colored bounding boxes on suspicious regions.
    High = Red, Medium = Orange/Yellow, Low = Blue.
    """
    annotated = img.copy()
    color_map = {
        "HIGH": (0, 0, 230),     # Red (BGR)
        "MEDIUM": (0, 165, 255), # Orange
        "LOW": (255, 191, 0)     # Amber/Blue
    }
    
    for item in regions:
        reg = item.get("region")
        if not reg:
            continue
        x, y, w, h = reg.get("x", 0), reg.get("y", 0), reg.get("width", 0), reg.get("height", 0)
        sev = item.get("severity", "MEDIUM")
        label = item.get("label", item.get("detector", "Anomaly"))
        
        color = color_map.get(sev, (0, 165, 255))
        
        # Draw translucent rectangle box
        overlay = annotated.copy()
        cv2.rectangle(overlay, (x, y), (x + w, y + h), color, -1)
        cv2.addWeighted(overlay, 0.25, annotated, 0.75, 0, annotated)
        cv2.rectangle(annotated, (x, y), (x + w, y + h), color, 2)
        
        # Text background badge
        text = f"{label} ({sev})"
        (txt_w, txt_h), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.45, 1)
        cv2.rectangle(annotated, (x, max(0, y - 20)), (x + txt_w + 6, max(0, y)), color, -1)
        cv2.putText(annotated, text, (x + 3, max(12, y - 5)), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1)

    return annotated
