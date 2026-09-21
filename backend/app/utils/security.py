import re
import uuid
import os

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal or unsafe characters."""
    base = os.path.basename(filename)
    clean = re.sub(r'[^a-zA-Z0-9_\.\-]', '_', base)
    if not clean:
        clean = f"document_{uuid.uuid4().hex[:8]}.png"
    return clean

def generate_unique_id(prefix: str = "SCR") -> str:
    """Generate human-readable unique screening ID."""
    uid = uuid.uuid4().hex[:6].upper()
    return f"{prefix}-{uid}"
