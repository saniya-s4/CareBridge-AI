import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('public/test-samples', exist_ok=True)

# -------------------------------------------------------------
# 1. Generate Realistic Laboratory Report JPEG
# -------------------------------------------------------------
width, height = 800, 700
img_lab = Image.new('RGB', (width, height), color=(255, 255, 255))
draw = ImageDraw.Draw(img_lab)

# Header
draw.rectangle([(0, 0), (width, 80)], fill=(15, 118, 110))
draw.text((30, 25), "METROHEALTH DIAGNOSTICS - CLINICAL PATHOLOGY", fill=(255, 255, 255))

# Patient info
draw.text((30, 100), "Patient Name: Alex Morgan", fill=(20, 20, 20))
draw.text((350, 100), "Date of Specimen: 2025-10-14", fill=(20, 20, 20))
draw.text((600, 100), "Status: Final", fill=(20, 20, 20))

draw.line([(30, 130), (770, 130)], fill=(200, 200, 200), width=1)

# Table Header
draw.rectangle([(30, 145), (770, 180)], fill=(240, 245, 245))
draw.text((40, 155), "TEST NAME", fill=(50, 50, 50))
draw.text((250, 155), "RESULT", fill=(50, 50, 50))
draw.text((360, 155), "UNITS", fill=(50, 50, 50))
draw.text((470, 155), "REFERENCE RANGE", fill=(50, 50, 50))
draw.text((680, 155), "FLAG", fill=(50, 50, 50))

# Table Rows
rows = [
    ("Hemoglobin", "10.2", "g/dL", "12.0 - 16.0", "LOW"),
    ("Hematocrit", "32.0", "%", "36.0 - 46.0", "LOW"),
    ("Fasting Glucose", "114", "mg/dL", "70 - 99", "HIGH"),
    ("Serum Creatinine", "0.92", "mg/dL", "0.60 - 1.20", "NORMAL"),
    ("Total Cholesterol", "218", "mg/dL", "< 200", "HIGH"),
    ("Potassium", "4.3", "mmol/L", "3.5 - 5.0", "NORMAL"),
    ("Sodium", "141", "mmol/L", "135 - 145", "NORMAL"),
    ("Platelet Count", "260", "x10^3/uL", "150 - 450", "NORMAL")
]

y = 200
for test, res, unit, ref, flag in rows:
    if flag in ("HIGH", "LOW"):
        draw.rectangle([(30, y - 5), (770, y + 25)], fill=(255, 248, 240))
    else:
        draw.line([(30, y + 25), (770, y + 25)], fill=(240, 240, 240), width=1)
        
    draw.text((40, y), test, fill=(10, 10, 10))
    draw.text((250, y), res, fill=(10, 10, 10))
    draw.text((360, y), unit, fill=(80, 80, 80))
    draw.text((470, y), ref, fill=(80, 80, 80))
    
    flag_color = (180, 50, 50) if flag == "HIGH" else (180, 120, 0) if flag == "LOW" else (20, 140, 80)
    draw.text((680, y), flag, fill=flag_color)
    y += 35

draw.rectangle([(30, 540), (770, 620)], fill=(245, 250, 250), outline=(200, 230, 230))
draw.text((45, 555), "LABORATORY NOTES:", fill=(30, 80, 80))
draw.text((45, 580), "Specimen processed via automated multichannel analyzer. Review in clinical context.", fill=(80, 80, 80))

img_lab.save('public/test-samples/lab_report.jpg', quality=95)
print("Created public/test-samples/lab_report.jpg")

# -------------------------------------------------------------
# 2. Generate Realistic Prescription / Clinical Note JPEG
# -------------------------------------------------------------
img_rx = Image.new('RGB', (width, height), color=(255, 255, 255))
draw_rx = ImageDraw.Draw(img_rx)

# Header
draw_rx.rectangle([(0, 0), (width, 90)], fill=(49, 46, 129))
draw_rx.text((30, 25), "VALLEY FAMILY MEDICAL PRACTICE", fill=(255, 255, 255))
draw_rx.text((30, 55), "Dr. Sarah Jenkins, MD | Internal Medicine | DEA #AJ928174", fill=(200, 200, 240))

# Patient Details
draw_rx.text((30, 115), "Patient: Alex Morgan", fill=(20, 20, 20))
draw_rx.text((350, 115), "DOB: 1988-04-12", fill=(20, 20, 20))
draw_rx.text((600, 115), "Date: 2025-11-05", fill=(20, 20, 20))

draw_rx.line([(30, 145), (770, 145)], fill=(210, 210, 230), width=2)

# Rx Symbol
draw_rx.text((40, 165), "Rx / PRESCRIPTION ORDER:", fill=(49, 46, 129))

# Medications Box
draw_rx.rectangle([(30, 200), (770, 370)], fill=(248, 250, 255), outline=(220, 225, 245))

draw_rx.text((50, 220), "1. Amoxicillin 500 mg Capsule", fill=(10, 10, 10))
draw_rx.text((80, 245), "Sig: Take 1 capsule orally three times daily with meals for 10 days.", fill=(70, 70, 90))
draw_rx.text((80, 270), "Dispense: #30 (Thirty) | Refills: 0", fill=(100, 100, 120))

draw_rx.text((50, 305), "2. Atorvastatin 20 mg Tablet", fill=(10, 10, 10))
draw_rx.text((80, 330), "Sig: Take 1 tablet orally once daily at bedtime for cholesterol management.", fill=(70, 70, 90))
draw_rx.text((80, 350), "Dispense: #90 (Ninety) | Refills: 3", fill=(100, 100, 120))

# Diagnosis & Doctor Notes
draw_rx.text((30, 400), "CLINICAL DIAGNOSIS & OBSERVATIONS:", fill=(30, 30, 30))
draw_rx.text((30, 430), "• Mild acute bacterial sinusitis responding to antibiotic therapy.", fill=(60, 60, 60))
draw_rx.text((30, 455), "• Hyperlipidemia: Initiate lifestyle adjustments and nightly statin therapy.", fill=(60, 60, 60))
draw_rx.text((30, 480), "• Patient advised to maintain adequate hydration and log daily blood pressure.", fill=(60, 60, 60))

draw_rx.line([(30, 540), (770, 540)], fill=(220, 220, 220), width=1)
draw_rx.text((30, 565), "Physician Signature: Dr. Sarah Jenkins, MD", fill=(50, 50, 100))
draw_rx.text((500, 565), "Follow-up: 6 weeks (Lipid Panel)", fill=(100, 100, 100))

img_rx.save('public/test-samples/prescription.jpg', quality=95)
print("Created public/test-samples/prescription.jpg")
