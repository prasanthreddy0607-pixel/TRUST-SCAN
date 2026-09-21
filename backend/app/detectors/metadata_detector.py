from PIL import Image, ExifTags
from typing import Dict, Any
from ..utils.pdf_utils import extract_pdf_metadata, is_pdf

class MetadataDetector:
    def analyze(self, image_path: str) -> Dict[str, Any]:
        """
        Inspect EXIF metadata or PDF container structure for editing software signatures.
        """
        editing_tools = ["photoshop", "gimp", "paint.net", "canva", "pixlr", "adobe illustrator", "imagemagick"]
        signals = []
        score = 0.0

        if is_pdf(image_path):
            meta = extract_pdf_metadata(image_path)
            creator = meta.get("creator", "").lower()
            producer = meta.get("producer", "").lower()

            for tool in editing_tools:
                if tool in creator or tool in producer:
                    signals.append(f"PDF creation/producer software indicates editing tool: {creator or producer}")
                    score += 0.50

            return {
                "detector": "metadata_anomaly",
                "score": min(0.90, round(score, 2)),
                "severity": "HIGH" if score >= 0.5 else "LOW",
                "status": "SUSPICIOUS" if score >= 0.5 else "CLEAN",
                "metadata_available": True,
                "signals": signals,
                "explanation": "PDF metadata indicates graphics/editing software usage." if signals else "PDF container metadata presents standard document authoring info.",
                "details": meta
            }

        # Image EXIF check
        try:
            img = Image.open(image_path)
            exif = img.getexif()
            if not exif:
                return {
                    "detector": "metadata_anomaly",
                    "score": 0.1,
                    "severity": "LOW",
                    "status": "CLEAN",
                    "metadata_available": False,
                    "signals": [],
                    "explanation": "No EXIF metadata present in image file.",
                    "details": {}
                }

            exif_data = {}
            for tag_id, val in exif.items():
                tag = ExifTags.TAGS.get(tag_id, str(tag_id))
                exif_data[tag] = str(val)

            software = exif_data.get("Software", "").lower()
            for tool in editing_tools:
                if tool in software:
                    signals.append(f"EXIF Software field contains graphics editor: {exif_data['Software']}")
                    score += 0.55

            score = min(0.90, round(score, 2))
            severity = "HIGH" if score >= 0.5 else "LOW"
            status = "SUSPICIOUS" if score >= 0.5 else "CLEAN"

            return {
                "detector": "metadata_anomaly",
                "score": score,
                "severity": severity,
                "status": status,
                "metadata_available": True,
                "signals": signals,
                "explanation": "Image EXIF metadata indicates editing software modification." if signals else "EXIF metadata is clean.",
                "details": exif_data
            }
        except Exception as e:
            return {
                "detector": "metadata_anomaly",
                "score": 0.0,
                "severity": "LOW",
                "status": "CLEAN",
                "metadata_available": False,
                "signals": [],
                "explanation": "Metadata analysis could not extract EXIF payload.",
                "details": {"error": str(e)}
            }

metadata_detector = MetadataDetector()
