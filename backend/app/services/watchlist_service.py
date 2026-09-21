from typing import Optional
from ..repositories.demo_repository import demo_repo
from ..models.screening import WatchlistMatchResult

class WatchlistService:
    def check_watchlist(self, document_number: Optional[str]) -> WatchlistMatchResult:
        res = demo_repo.check_watchlist(document_number)
        return WatchlistMatchResult(
            matched=res["matched"],
            document_number=res["document_number"],
            status=res["status"],
            reason=res["reason"],
            disclaimer=res["disclaimer"]
        )

watchlist_service = WatchlistService()
