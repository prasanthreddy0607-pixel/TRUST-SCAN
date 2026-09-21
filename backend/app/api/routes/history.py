from fastapi import APIRouter
from typing import List
from ...repositories.screening_repository import screening_repo
from ...models.screening import ScreeningRecord

router = APIRouter()

@router.get("/history", response_model=List[ScreeningRecord])
async def get_history(limit: int = 50):
    screenings = await screening_repo.list_screenings(limit=limit)
    return screenings
