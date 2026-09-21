import os
import json
from typing import Dict, Any, List, Optional
from ..config import settings
from ..models.screening import ScreeningRecord

# Local in-memory repository fallback
_LOCAL_STORAGE: Dict[str, Dict[str, Any]] = {}
_LOCAL_FILE = os.path.join(settings.BASE_DIR, "data_store.json")

def _load_local_data():
    global _LOCAL_STORAGE
    if os.path.exists(_LOCAL_FILE):
        try:
            with open(_LOCAL_FILE, "r", encoding="utf-8") as f:
                _LOCAL_STORAGE = json.load(f)
        except Exception:
            _LOCAL_STORAGE = {}

def _save_local_data():
    try:
        with open(_LOCAL_FILE, "w", encoding="utf-8") as f:
            json.dump(_LOCAL_STORAGE, f, indent=2)
    except Exception as e:
        print(f"Error saving local storage: {e}")

_load_local_data()

class ScreeningRepository:
    def __init__(self):
        self.use_mongo = False
        self.db = None
        if settings.MONGODB_URI:
            try:
                import motor.motor_asyncio
                self.client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
                self.db = self.client[settings.DATABASE_NAME]
                self.use_mongo = True
            except Exception as e:
                print(f"MongoDB connection initialization failed: {e}. Using local JSON repository.")
                self.use_mongo = False

    async def save_screening(self, record: ScreeningRecord) -> str:
        record_dict = record.model_dump()
        if self.use_mongo and self.db is not None:
            try:
                await self.db.screenings.replace_one(
                    {"screening_id": record.screening_id},
                    record_dict,
                    upsert=True
                )
                return record.screening_id
            except Exception as e:
                print(f"MongoDB save failed: {e}. Falling back to local storage.")
        
        # Local JSON fallback
        _LOCAL_STORAGE[record.screening_id] = record_dict
        _save_local_data()
        return record.screening_id

    async def get_screening(self, screening_id: str) -> Optional[ScreeningRecord]:
        if self.use_mongo and self.db is not None:
            try:
                doc = await self.db.screenings.find_one({"screening_id": screening_id})
                if doc:
                    doc.pop("_id", None)
                    return ScreeningRecord(**doc)
            except Exception as e:
                print(f"MongoDB find failed: {e}. Checking local storage.")
        
        if screening_id in _LOCAL_STORAGE:
            return ScreeningRecord(**_LOCAL_STORAGE[screening_id])
        return None

    async def list_screenings(self, limit: int = 50) -> List[ScreeningRecord]:
        results = []
        if self.use_mongo and self.db is not None:
            try:
                cursor = self.db.screenings.find({}).sort("created_at", -1).limit(limit)
                async for doc in cursor:
                    doc.pop("_id", None)
                    results.append(ScreeningRecord(**doc))
                return results
            except Exception as e:
                print(f"MongoDB list failed: {e}. Reading local storage.")

        # Local storage fallback
        records = sorted(
            list(_LOCAL_STORAGE.values()),
            key=lambda x: x.get("created_at", ""),
            reverse=True
        )
        return [ScreeningRecord(**r) for r in records[:limit]]

    async def delete_screening(self, screening_id: str) -> bool:
        if self.use_mongo and self.db is not None:
            try:
                res = await self.db.screenings.delete_one({"screening_id": screening_id})
                if res.deleted_count > 0:
                    return True
            except Exception as e:
                print(f"MongoDB delete failed: {e}")

        if screening_id in _LOCAL_STORAGE:
            del _LOCAL_STORAGE[screening_id]
            _save_local_data()
            return True
        return False

screening_repo = ScreeningRepository()
