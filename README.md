# CareBridge AI

> **Understand your reports. Prepare for better conversations with your doctor.**

CareBridge AI turns complex medical lab reports into structured data, plain-language explanations, trend charts, and a doctor-visit checklist.

> ⚠️ Educational prototype. It does not diagnose, prescribe, or replace professional medical advice.

## ✨ Features

- 📄 **Report Analysis** – upload a file or paste text; extracts test name, value, unit, reference range, and status (missing info is marked *Unknown*, never invented)
- 📊 **Comparison** – compare reports across dates (e.g. Hemoglobin 11.2 → 10.2 g/dL, *Decreased*)
- 📈 **Trends** – interactive charts for recurring biomarkers
- 🩺 **Doctor Visit Prep** – key observations, questions to ask, things to bring, copy/print checklist
- 🎯 **Demo Mode** – fictional sample reports, no personal data needed
- 🔒 **Privacy First** – data stays in your browser (localStorage)

## 🛠️ Tech Stack

React + Vite · Tailwind CSS · Recharts · Lucide React · Google Gemini API · Vercel Serverless Functions

## 🛡️ Responsible AI

- No diagnosis, prescriptions, or treatment advice
- Neutral wording: *Increased / Decreased / Similar*
- Extracted data is kept separate from AI explanations
- Safety disclaimer shown on every screen

## 🚀 Getting Started

```bash
git clone https://github.com/saniya-s4/CareBridge-AI.git
cd CareBridge-AI
npm install
```

Create a `.env` file:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

```bash
npm run dev
```

Open `http://localhost:5173`. Never commit `.env`.

## ☁️ Deployment

Import the repo into Vercel, add `GEMINI_API_KEY` as an environment variable, and deploy.

## 🎬 Demo

1. Click **Try Demo Report**
2. Open **Compare & Trends** to see changes over time
3. Open **Doctor Visit Prep** to get the checklist

## 🌱 Future Scope

FHIR/EHR integration · Multilingual explanations · Voice-guided prep · Wearable data correlation

---

*Built for hackathon demonstration. Always consult a qualified healthcare professional for medical decisions.*
