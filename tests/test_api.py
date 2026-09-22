import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "services" in data

def test_demo_scenarios_list():
    response = client.get("/api/demo")
    assert response.status_code == 200
    scenarios = response.json()
    assert len(scenarios) == 8

def test_run_demo_scenario():
    response = client.post("/api/demo/run/clean_passport")
    assert response.status_code == 200
    record = response.json()
    assert record["document_type"] == "passport"
    assert record["risk_assessment"]["risk_level"] == "LOW"

def test_history_endpoint():
    response = client.get("/api/history")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_check_face_liveness():
    import io
    from PIL import Image
    # Create dummy RGB image
    img = Image.new('RGB', (100, 100), color='blue')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr = img_byte_arr.getvalue()

    response = client.post(
        "/api/face/check-liveness",
        files={"reference_photo": ("test.jpg", img_byte_arr, "image/jpeg")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "is_human" in data
    assert "confidence" in data
    assert "details" in data

