from PIL import Image, ImageDraw, ImageFont
import cv2
import numpy as np
import os

DEMO_DIR = os.path.dirname(os.path.abspath(__file__))
os.makedirs(DEMO_DIR, exist_ok=True)

def create_synthetic_passport(
    filename: str,
    name: str = "SAMPLE PERSON",
    passport_num: str = "DEMO-P123456",
    dob: str = "15 APR 2002",
    mrz_dob: str = "850415", # YYMMDD
    expiry: str = "14 APR 2032",
    tamper_photo: bool = False,
    tamper_dob_text: bool = False
):
    w, h = 800, 520
    # Dark navy border document background canvas
    img = Image.new('RGB', (w, h), color='#1e293b')
    draw = ImageDraw.Draw(img)

    # Document Header & Title Banner
    draw.rectangle([20, 20, w-20, 70], fill='#0f172a', outline='#3b82f6', width=2)
    draw.text((35, 32), "PASSPORT / PASSEPORT — DEMO SPECIMEN", fill='#f8fafc')

    # Draw Photo Frame Region
    photo_box = [40, 100, 240, 360]
    draw.rectangle(photo_box, fill='#334155', outline='#64748b', width=2)

    # Render Synthetic Face Silhouette inside Photo Frame
    face_img = Image.new('RGB', (200, 260), color='#475569')
    f_draw = ImageDraw.Draw(face_img)
    # Head circle & shoulders
    f_draw.ellipse([50, 40, 150, 150], fill='#94a3b8')
    f_draw.ellipse([20, 140, 180, 280], fill='#64748b')
    
    if tamper_photo:
        # Insert anomalous bright red/purple noise patch to simulate photo paste-over tampering
        t_patch = Image.new('RGB', (120, 120), color='#7e22ce')
        face_img.paste(t_patch, (40, 60))
        # Draw high contrast boundary artifact line
        f_draw.line([(0, 0), (200, 0)], fill='#ef4444', width=6)

    img.paste(face_img, (40, 100))

    # Data Fields Block
    x_start = 270
    fields = [
        ("Type / Code:", "P / DEMO"),
        ("Issuing Country:", "DEMO LAND"),
        ("Passport No:", passport_num),
        ("Surname / Given Names:", name),
        ("Date of Birth:", "15 APR 2001" if tamper_dob_text else dob),
        ("Sex:", "M"),
        ("Nationality:", "DEMOCRATIC CITIZEN"),
        ("Date of Expiry:", expiry)
    ]

    y_curr = 100
    for label, val in fields:
        draw.text((x_start, y_curr), label, fill='#94a3b8')
        draw.text((x_start + 160, y_curr), val, fill='#ffffff')
        y_curr += 32

    # Draw MRZ Region Box at bottom
    draw.rectangle([20, 400, w-20, 500], fill='#020617', outline='#475569', width=1)
    
    # Format ICAO TD3 MRZ Lines (44 characters)
    line1 = f"P<DEMO{name.replace(' ', '<<')}<<<<<<<<<<<<<<<<<<<<<<"[:44]
    line2 = f"{passport_num.replace('-', '')}<0DEM8504152M3204147<<<<<<<<<<<<<<02"[:44]

    draw.text((35, 415), line1, fill='#38bdf8')
    draw.text((35, 450), line2, fill='#38bdf8')

    out_path = os.path.join(DEMO_DIR, filename)
    img.save(out_path)
    print(f"Generated synthetic demo document: {out_path}")
    return out_path

def generate_all_demo_files():
    # 1. Clean Passport
    create_synthetic_passport("clean_passport.png")
    # 2. Tampered Photo Passport
    create_synthetic_passport("tampered_photo_passport.png", tamper_photo=True)
    # 3. DOB Mismatch Passport
    create_synthetic_passport("dob_mismatch_passport.png", tamper_dob_text=True)
    # 4. Multiple Anomaly Passport
    create_synthetic_passport("multiple_anomaly_passport.png", tamper_photo=True, tamper_dob_text=True)
    # 5. Expired Passport
    create_synthetic_passport("expired_passport.png", expiry="14 APR 2021")
    # 6. Watchlist Passport
    create_synthetic_passport("watchlist_passport.png", passport_num="DEMO-BLOCK-001")
    # 7. Reference Photo
    ref_img = Image.new('RGB', (300, 350), color='#334155')
    r_draw = ImageDraw.Draw(ref_img)
    r_draw.ellipse([80, 50, 220, 200], fill='#94a3b8')
    r_draw.ellipse([40, 190, 260, 360], fill='#64748b')
    ref_img.save(os.path.join(DEMO_DIR, "reference_photo.png"))

if __name__ == "__main__":
    generate_all_demo_files()
