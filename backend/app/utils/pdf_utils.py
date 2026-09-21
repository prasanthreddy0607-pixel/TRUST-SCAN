import fitz  # PyMuPDF
from PIL import Image
import io
import os
from typing import List, Tuple

def is_pdf(file_path: str) -> bool:
    """Check if file is a PDF based on extension or header."""
    return file_path.lower().endswith(".pdf")

def convert_pdf_to_images(pdf_path: str, max_pages: int = 5, dpi: int = 200) -> List[Image.Image]:
    """Convert PDF pages to a list of PIL Images."""
    images = []
    try:
        doc = fitz.open(pdf_path)
        for page_num in range(min(len(doc), max_pages)):
            page = doc[page_num]
            pix = page.get_pixmap(dpi=dpi)
            img_data = pix.tobytes("png")
            img = Image.open(io.BytesIO(img_data)).convert("RGB")
            images.append(img)
        doc.close()
    except Exception as e:
        print(f"Error converting PDF {pdf_path}: {e}")
    return images

def extract_pdf_metadata(pdf_path: str) -> dict:
    """Extract structural metadata from PDF."""
    try:
        doc = fitz.open(pdf_path)
        metadata = doc.metadata
        page_count = len(doc)
        doc.close()
        return {
            "is_pdf": True,
            "page_count": page_count,
            "format": metadata.get("format", ""),
            "title": metadata.get("title", ""),
            "author": metadata.get("author", ""),
            "creator": metadata.get("creator", ""),
            "producer": metadata.get("producer", ""),
            "creation_date": metadata.get("creationDate", ""),
            "mod_date": metadata.get("modDate", "")
        }
    except Exception as e:
        return {"is_pdf": True, "error": str(e)}
