from typing import Dict, Any, Optional

DEMO_WATCHLIST: Dict[str, Dict[str, Any]] = {
    "DEMO-BLOCK-001": {
        "document_number": "DEMO-BLOCK-001",
        "status": "REVIEW_REQUIRED",
        "reason": "Synthetic demo record — Flagged in mock demonstration list for lost/stolen document testing",
        "disclaimer": "Demo database — not connected to government systems."
    },
    "DEMO-P999999": {
        "document_number": "DEMO-P999999",
        "status": "REVIEW_REQUIRED",
        "reason": "Synthetic demo record — Flagged for manual verification in demo scenario",
        "disclaimer": "Demo database — not connected to government systems."
    },
    "DEMO-WATCH-555": {
        "document_number": "DEMO-WATCH-555",
        "status": "REVIEW_REQUIRED",
        "reason": "Synthetic demo record — Interpol mock stolen travel document database entry",
        "disclaimer": "Demo database — not connected to government systems."
    }
}

class DemoRepository:
    def check_watchlist(self, document_number: Optional[str]) -> Dict[str, Any]:
        disclaimer = "Demo database — not connected to government systems."
        if not document_number:
            return {
                "matched": False,
                "document_number": None,
                "status": "CLEAN",
                "reason": None,
                "disclaimer": disclaimer
            }
        
        doc_clean = document_number.strip().upper()
        if doc_clean in DEMO_WATCHLIST:
            match_data = DEMO_WATCHLIST[doc_clean]
            return {
                "matched": True,
                "document_number": doc_clean,
                "status": match_data["status"],
                "reason": match_data["reason"],
                "disclaimer": disclaimer
            }
        
        return {
            "matched": False,
            "document_number": doc_clean,
            "status": "CLEAN",
            "reason": None,
            "disclaimer": disclaimer
        }

demo_repo = DemoRepository()
