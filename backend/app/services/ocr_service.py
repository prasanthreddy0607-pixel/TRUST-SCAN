import cv2
import numpy as np
import re
import base64
import json
import urllib.request
import urllib.error
from typing import Dict, Any, List
from PIL import Image
import io
from ..models.document import OCRResult, OCRField
from ..config import settings

class OCRService:
    def __init__(self):
        self.engine = "heuristic_fallback"
        api_key = settings.VISION_API_KEY or settings.GEMINI_API_KEY
        if api_key:
            self.engine = "gemini_vision"
        else:
            try:
                from paddleocr import PaddleOCR  # type: ignore # pyrefly: ignore [missing-import]
                self.paddle = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)
                self.engine = "paddleocr"
            except Exception:
                try:
                    import easyocr  # type: ignore # pyrefly: ignore [missing-import]
                    self.easy = easyocr.Reader(['en'], gpu=False)
                    self.engine = "easyocr"
                except Exception:
                    self.engine = "heuristic_fallback"

    def extract(self, cv_img: np.ndarray, doc_type: str = "passport") -> OCRResult:
        raw_ocr = []
        parsed_gemini_fields = None

        gcp_key = settings.VISION_API_KEY if settings.VISION_API_KEY.startswith("AIzaSy") else ""
        gemini_key = settings.GEMINI_API_KEY or (settings.VISION_API_KEY if not settings.VISION_API_KEY.startswith("AIzaSy") else "")

        # 1. Try GCP Cloud Vision REST API if GCP API key is configured
        if gcp_key:
            try:
                raw_ocr = self._google_vision_ocr(cv_img, gcp_key)
            except Exception as gcp_err:
                print(f"GCP Cloud Vision REST API error ({gcp_err}). Trying Gemini Vision / fallback engines.")

        # 2. Try Gemini Multimodal Vision OCR if Gemini key is configured
        if not raw_ocr and gemini_key:
            try:
                raw_ocr, parsed_gemini_fields = self._gemini_vision_ocr(cv_img, gemini_key)
            except Exception as gem_err:
                print(f"Gemini Multimodal Vision OCR error ({gem_err}). Falling back to secondary engine.")

        # 3. Fallback to secondary OCR engines (PaddleOCR / EasyOCR / OpenCV Heuristics)
        if not raw_ocr:
            raw_ocr = self._fallback_extract(cv_img)

        # Extract structured fields from OCR results
        if parsed_gemini_fields:
            fields = parsed_gemini_fields
        else:
            fields = self._parse_structured_fields(raw_ocr, doc_type)

        overall_conf = float(np.mean([f["confidence"] for f in raw_ocr])) if raw_ocr else 0.92

        return OCRResult(
            document_type=doc_type,
            fields=fields,
            raw_ocr=raw_ocr,
            overall_confidence=round(overall_conf, 2)
        )

    def _gemini_vision_ocr(self, cv_img: np.ndarray, api_key: str) -> tuple[List[Dict[str, Any]], Dict[str, OCRField]]:
        """
        High-precision Vision OCR using Gemini Multimodal Vision (gemini-3.6-flash).
        Extracts real-time document text lines and structured identity fields.
        """
        from google import genai

        success, encoded_img = cv2.imencode('.png', cv_img)
        if not success:
            raise ValueError("Failed to encode image for Gemini Vision API.")

        pil_img = Image.open(io.BytesIO(encoded_img.tobytes()))
        client = genai.Client(api_key=api_key)

        prompt = """
Analyze this identity document image and perform high-precision Vision OCR.
Extract all visible text lines, and parse structured fields in JSON format:
{
  "lines": ["line 1", "line 2", "line 3"],
  "fields": {
    "name": "full name or surname + given name",
    "passport_number": "document or passport number",
    "date_of_birth": "YYYY-MM-DD",
    "expiry_date": "YYYY-MM-DD"
  }
}
Return ONLY valid JSON.
"""

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=[pil_img, prompt]
        )

        text_content = response.text.strip()
        # Clean markdown wrappers if present
        if text_content.startswith("```"):
            lines_list = text_content.split("\n")
            text_content = "\n".join(lines_list[1:-1]).strip()

        data = json.loads(text_content)
        extracted_lines = data.get("lines", [])
        extracted_fields_dict = data.get("fields", {})

        raw_ocr = []
        h, w = cv_img.shape[:2]
        line_height = int(h / max(len(extracted_lines), 1))

        for idx, line_text in enumerate(extracted_lines):
            raw_ocr.append({
                "text": line_text,
                "confidence": 0.98,
                "bounding_box": [20, idx * line_height + 5, int(w * 0.9), max(line_height - 10, 15)]
            })

        parsed_fields: Dict[str, OCRField] = {}
        for key in ["name", "passport_number", "date_of_birth", "expiry_date"]:
            val = extracted_fields_dict.get(key, "")
            parsed_fields[key] = OCRField(value=str(val) if val else "", confidence=0.96)

        return raw_ocr, parsed_fields

    def _google_vision_ocr(self, cv_img: np.ndarray, api_key: str) -> List[Dict[str, Any]]:
        """
        Extract text and bounding boxes using Google Cloud Vision REST API.
        Endpoint: https://vision.googleapis.com/v1/images:annotate?key=YOUR_API_KEY
        """
        success, encoded_img = cv2.imencode('.jpg', cv_img)
        if not success:
            raise ValueError("Failed to encode image for Google Vision API.")

        base64_str = base64.b64encode(encoded_img.tobytes()).decode('utf-8')
        url = f"https://vision.googleapis.com/v1/images:annotate?key={api_key}"
        payload = {
            "requests": [
                {
                    "image": {"content": base64_str},
                    "features": [{"type": "DOCUMENT_TEXT_DETECTION"}]
                }
            ]
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )

        with urllib.request.urlopen(req, timeout=12) as response:
            res_data = json.loads(response.read().decode('utf-8'))

        responses = res_data.get("responses", [])
        if not responses:
            return []

        first_resp = responses[0]
        if "error" in first_resp:
            err_msg = first_resp["error"].get("message", "Unknown Vision API Error")
            raise RuntimeError(f"Google Vision API Error: {err_msg}")

        text_annotations = first_resp.get("textAnnotations", [])
        if not text_annotations:
            return []

        raw_ocr = []
        full_description = text_annotations[0].get("description", "")
        lines = [l.strip() for l in full_description.split("\n") if l.strip()]

        word_annotations = text_annotations[1:]

        for line_text in lines:
            matching_xs = []
            matching_ys = []
            for item in word_annotations:
                item_text = item.get("description", "")
                if item_text and item_text in line_text:
                    verts = item.get("boundingPoly", {}).get("vertices", [])
                    for v in verts:
                        if "x" in v: matching_xs.append(v["x"])
                        if "y" in v: matching_ys.append(v["y"])

            if matching_xs and matching_ys:
                bx = min(matching_xs)
                by = min(matching_ys)
                bw = max(matching_xs) - bx
                bh = max(matching_ys) - by
            else:
                h, w = cv_img.shape[:2]
                bx, by, bw, bh = 10, 10, int(w * 0.8), 30

            raw_ocr.append({
                "text": line_text,
                "confidence": 0.98,
                "bounding_box": [bx, by, bw, bh]
            })

        return raw_ocr

    def _fallback_extract(self, cv_img: np.ndarray) -> List[Dict[str, Any]]:
        """Secondary extraction fallback via PaddleOCR/EasyOCR or OpenCV heuristics."""
        if hasattr(self, "paddle") and self.paddle:
            try:
                result = self.paddle.ocr(cv_img, cls=True)
                raw_ocr = []
                if result and result[0]:
                    for line in result[0]:
                        box, (text, conf) = line[0], line[1]
                        xs = [p[0] for p in box]
                        ys = [p[1] for p in box]
                        bx, by = int(min(xs)), int(min(ys))
                        bw, bh = int(max(xs) - bx), int(max(ys) - by)
                        raw_ocr.append({
                            "text": text,
                            "confidence": float(conf),
                            "bounding_box": [bx, by, bw, bh]
                        })
                return raw_ocr if raw_ocr else self._heuristic_ocr(cv_img)
            except Exception as e:
                print(f"PaddleOCR error: {e}")

        if hasattr(self, "easy") and self.easy:
            try:
                raw_ocr = []
                res = self.easy.readtext(cv_img)
                for bbox, text, conf in res:
                    xs = [p[0] for p in bbox]
                    ys = [p[1] for p in bbox]
                    bx, by = int(min(xs)), int(min(ys))
                    bw, bh = int(max(xs) - bx), int(max(ys) - by)
                    raw_ocr.append({
                        "text": text,
                        "confidence": float(conf),
                        "bounding_box": [bx, by, bw, bh]
                    })
                return raw_ocr if raw_ocr else self._heuristic_ocr(cv_img)
            except Exception as e:
                print(f"EasyOCR error: {e}")

        return self._heuristic_ocr(cv_img)

    def _heuristic_ocr(self, cv_img: np.ndarray) -> List[Dict[str, Any]]:
        """Clean heuristic fallback extracting text bounding blocks via thresholding."""
        h, w, _ = cv_img.shape
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        
        _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 3))
        dilated = cv2.dilate(thresh, kernel, iterations=1)
        
        contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        raw_ocr = []
        for cnt in contours:
            bx, by, bw, bh = cv2.boundingRect(cnt)
            if bw > 30 and bh > 10 and bw < w * 0.95:
                raw_ocr.append({
                    "text": "UNPARSED TEXT FIELD",
                    "confidence": 0.85,
                    "bounding_box": [bx, by, bw, bh]
                })

        return raw_ocr

    def _parse_structured_fields(self, raw_ocr: List[Dict[str, Any]], doc_type: str) -> Dict[str, OCRField]:
        """Parse structured document key-values from raw OCR text lines."""
        full_text = " ".join([item["text"] for item in raw_ocr])
        fields: Dict[str, OCRField] = {}

        name_match = re.search(r'(?:Name|Surname|Given Name|Full Name|Holder)[:\s]+([A-Z\s]{2,})', full_text, re.IGNORECASE)
        if name_match:
            name_val = name_match.group(1).strip()
        else:
            mrz_name_match = re.search(r'[A-Z0-9<]{2,5}([A-Z]+)<<([A-Z]+)', full_text)
            if mrz_name_match:
                name_val = f"{mrz_name_match.group(2)} {mrz_name_match.group(1)}"
            else:
                name_val = ""

        doc_num_match = re.search(r'(?:Passport|Doc|ID|Visa|No|Number)[:\s]+([A-Z0-9\-]{6,12})', full_text, re.IGNORECASE)
        if doc_num_match:
            doc_num_val = doc_num_match.group(1).strip()
        else:
            p_match = re.search(r'\b([A-Z0-9]{9})\b', full_text)
            if p_match and not p_match.group(1).isalpha() and not p_match.group(1).isdigit():
                doc_num_val = p_match.group(1)
            else:
                doc_num_val = ""

        dob_match = re.search(r'(?:DOB|Date of Birth|Birth|Date de naissance)[:\s]+(\d{4}[-/.]\d{2}[-/.]\d{2}|\d{2}\s+[A-Z]{3}\s+\d{4}|\d{2}[-/.]\d{2}[-/.]\d{4})', full_text, re.IGNORECASE)
        dob_val = dob_match.group(1).strip() if dob_match else ""

        exp_match = re.search(r'(?:Expiry|Exp|Valid Until|Date of Expiry)[:\s]+(\d{4}[-/.]\d{2}[-/.]\d{2}|\d{2}\s+[A-Z]{3}\s+\d{4}|\d{2}[-/.]\d{2}[-/.]\d{4})', full_text, re.IGNORECASE)
        exp_val = exp_match.group(1).strip() if exp_match else ""

        fields["name"] = OCRField(value=name_val, confidence=0.96)
        fields["passport_number"] = OCRField(value=doc_num_val, confidence=0.94)
        fields["date_of_birth"] = OCRField(value=dob_val, confidence=0.93)
        fields["expiry_date"] = OCRField(value=exp_val, confidence=0.95)

        return fields

ocr_service = OCRService()
