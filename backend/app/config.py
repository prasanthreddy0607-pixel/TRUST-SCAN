import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "TRUST SCAN"
    TAGLINE: str = "Evidence-first identity & document screening"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Security & Storage
    MAX_FILE_SIZE_MB: int = int(os.getenv("MAX_FILE_SIZE_MB", "10"))
    ALLOWED_EXTENSIONS: set = {"jpg", "jpeg", "png", "pdf"}
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "uploads")
    REPORTS_DIR: str = os.path.join(BASE_DIR, "reports_gen")
    
    # Environment Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    VISION_API_KEY: str = os.getenv("VISION_API_KEY", "")
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "trustscan")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    # Risk Engine Configurable Weights
    WEIGHT_TAMPERING: float = 0.35
    WEIGHT_VALIDATION: float = 0.20
    WEIGHT_MRZ_OCR: float = 0.20
    WEIGHT_FACE: float = 0.15
    WEIGHT_METADATA: float = 0.10

settings = Settings()

# Ensure target storage folders exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
