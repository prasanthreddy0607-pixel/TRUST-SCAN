from fastapi import APIRouter, UploadFile, File, HTTPException, status
import os
from typing import Dict, Any
from ...config import settings
from ...utils.security import sanitize_filename
from ...services.comparison_service import comparison_service

router = APIRouter()

_COMPARISONS_STORE: Dict[str, Any] = {}

@router.post("/compare")
async def compare_documents(
    original_file: UploadFile = File(...),
    presented_file: UploadFile = File(...)
):
    safe_orig = sanitize_filename(original_file.filename)
    safe_pres = sanitize_filename(presented_file.filename)

    orig_path = os.path.join(settings.UPLOAD_DIR, f"cmp_orig_{safe_orig}")
    pres_path = os.path.join(settings.UPLOAD_DIR, f"cmp_pres_{safe_pres}")

    with open(orig_path, "wb") as f:
        f.write(await original_file.read())
    with open(pres_path, "wb") as f:
        f.write(await presented_file.read())

    res = comparison_service.compare_documents(orig_path, pres_path, settings.UPLOAD_DIR)
    _COMPARISONS_STORE[res["comparison_id"]] = res
    return res

@router.get("/compare/{comparison_id}")
async def get_comparison(comparison_id: str):
    if comparison_id in _COMPARISONS_STORE:
        return _COMPARISONS_STORE[comparison_id]
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Comparison '{comparison_id}' not found.")
