# TRUST SCAN — Evidence-First Identity & Document Screening Platform

> **Tagline:** Evidence-first identity & document screening

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.0-emerald.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)

---

## 1. Problem Statement

Border checkpoints and screening facilities process large volumes of identity and travel documents (passports, visas, national IDs, permits, and licenses). Human screening officers must rapidly evaluate documents to identify potential:
- Altered facial photographs
- Modified text data fields
- Inconsistent dates
- Forged stamps or seals
- Expired documents
- Rule violations
- Discrepancies between OCR text and MRZ payloads
- Watchlist entries

**TRUST SCAN** is a decision-support prototype system that assists human officers by providing structured, evidence-based risk assessments.

> **IMPORTANT DISCLAIMER:** TRUST SCAN is a decision-support platform. It never makes autonomous border entry/denial decisions or claims definitive proof of fraud. All outputs use neutral terminology such as *"Potential Tampering"*, *"Anomaly Detected"*, and *"Manual Verification Recommended"*.

---

## 2. Core Architecture & Modules

TRUST SCAN consists of 8 core functional modules:
1. **Module 1 — OCR Extraction**: Multi-engine OCR (PaddleOCR / EasyOCR / Heuristic fallback) extracting structured fields, raw bounding boxes, and confidence metrics.
2. **Module 2 — Document Validation**: Rule engine validating passports, visas, national IDs, licenses, and permits.
3. **Module 3 — Tampering Detection**: 8 forensic detectors analyzing photo edge continuity, ELA compression, text font stroke width, layout geometry, spatial noise variance, blur patches, metadata EXIF, and official ink stamps.
4. **Module 4 — Face Verification**: Cosine feature similarity matching document photo against live reference photo.
5. **Module 5 — Risk & Evidence Engine**: Transparent weighted risk scoring (Tampering 35%, Validation 20%, MRZ/OCR 20%, Face 15%, Metadata 10%) producing LOW (0–29), MEDIUM (30–59), and HIGH (60–100) risk levels with traceable evidence items.
6. **Module 6 — Officer Dashboard**: Dashboard analytics, Recharts risk distribution charts, and audit inspection history log.
7. **Module 7 — Document Comparison**: Align baseline original vs. presented document to compute pixel difference heatmaps and changed region bounding boxes.
8. **Module 8 — Report Generation**: Auto-generates PDF reports via ReportLab with executive findings and disclaimers.

---

## 3. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, Axios, React Router.
- **Backend**: Python 3.11+, FastAPI, Pydantic, Uvicorn, Motor, PyMongo.
- **Computer Vision & PDF**: OpenCV, Pillow, NumPy, PyMuPDF (fitz), ReportLab.
- **AI Explanation**: Gemini API (`google-genai`) with deterministic fallback.
- **Database**: MongoDB Atlas with local in-memory JSON fallback repository (`trustscan`).

---

## 4. Local Run Instructions

### Prerequisites
- Python 3.11+
- Node.js v18+ & npm

### Backend Setup
```bash
# 1. Install dependencies
pip install -r backend/requirements.txt

# 2. Generate synthetic demo dataset
python demo_data/generate_demo_docs.py

# 3. Start Uvicorn FastAPI Server
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- API Base URL: `http://localhost:8000`
- Swagger Docs: `http://localhost:8000/docs`

### Frontend Setup
```bash
# 1. Install Node packages
cd frontend
npm install

# 2. Run Vite Dev Server
npm run dev
```
- Frontend UI: `http://localhost:5173`

---

## 5. Preset Hackathon Demo Mode

1. Open `http://localhost:5173`
2. Click **[Try Demo]** or navigate to `/demo-mode`
3. Select any preset scenario:
   - **Clean Synthetic Passport** (Low Risk)
   - **Modified Photo Passport** (High Risk — Photo ELA Anomaly)
   - **Modified DOB Passport** (High Risk — MRZ Discrepancy)
   - **Multiple Modification Passport** (High Risk — Multiple Anomalies)
   - **Expired Demo Passport** (High Risk — Date Failure)
   - **Demo Watchlist Match** (High Risk — Synthetic Watchlist Entry)

---

## 6. Testing

Run pytest suite covering OCR, MRZ, validation, tampering, risk engine, comparison, and API routes:
```bash
pytest
```

---

## 7. Privacy & Ethical Considerations
- All synthetic documents contain demo specimen names ("SAMPLE PERSON", "DEMO LAND").
- No real government document databases are accessed.
- Results require human officer verification and do not constitute legal proof of authenticity, fraud, or identity.
