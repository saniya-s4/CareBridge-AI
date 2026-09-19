# CareBridge AI
> **"Understand your reports. Prepare for better conversations with your doctor."**

*A modern AI-powered health report understanding and doctor-visit preparation assistant.*  
**Hackathon Prototype Notice:** CareBridge AI is an educational health information and decision-support prototype built for hackathon demonstration. It does **not** diagnose diseases, prescribe treatments, or substitute for professional medical consultation.

---

## 1. Project Name
**CareBridge AI** (Bridging the gap between complex medical lab reports and informed doctor conversations).

---

## 2. Problem Statement
Every year, hundreds of millions of patients receive routine or specialized blood tests and pathology panels. Upon receiving their lab results, patients frequently encounter:
- **Medical Jargon & Cryptic Metrics:** Obscure acronyms (e.g., eGFR, BUN, MCV, Ferritin) and reference intervals that cause unnecessary panic or unwarranted complacency.
- **Disconnected Fragmented History:** Lab reports are usually stored as static PDFs or printed paper sheets, making it tedious and difficult to track changes and trends between baseline and follow-up tests over time.
- **Rushed Doctor Visits:** Primary care appointments often last only 10 to 15 minutes. Patients arrive unprepared, overwhelmed by raw numbers, and fail to ask the most relevant questions about their health trajectory.

---

## 3. The Solution
**CareBridge AI** transforms intimidating lab documents into structured, understandable, and actionable health decision support:
1. **Extracts Structured Data:** Automatically parses biomarkers, values, units, reference intervals, and status flags without inventing missing parameters.
2. **Side-by-Side Comparison:** Matches recurring tests across consecutive reports, computes directional shifts (`Increased`, `Decreased`, `Similar`, `Unable to compare`), and plots longitudinal trend charts using Recharts.
3. **Non-Diagnostic Explanations:** Translates medical findings into plain language through a 4-part framework highlighting what stands out and what tests measure.
4. **Doctor Visit Preparation:** Synthesizes notable shifts into customized doctor questions, items to bring, and a single-click printable/copyable checklist.

---

## 4. Key Features
- **Executive Health Dashboard:** Tracks total reports archived, biomarkers monitored, and shifts detected across consecutive lab panels.
- **Multimodal Report Input:** Supports file upload (`.txt`, `.pdf`, `.png`, `.jpg`, `.csv`) alongside an instant text-paste fallback.
- **Structured Biomarker Extraction:** Standardizes measurements into `testName`, `value`, `unit`, `referenceRange`, and `status` (`Normal`, `High`, `Low`, `Unknown`).
- **Interactive Search & Filter:** Filter lab results by abnormal vs. normal, or search for specific biomarkers instantly.
- **Multi-Report Comparison:** Side-by-side comparison between any two dates with delta calculations (`11.2 → 10.2 g/dL`, `-1.0 g/dL`, `Decreased`).
- **Longitudinal Trend Charts:** Interactive Recharts line charts showing biomarker progression across multiple testing dates.
- **Chronological Health Timeline:** Visual timeline of historical lab visits with date stamps and abnormal flag summaries.
- **Doctor Appointment Preparation:**
  - Key Observations summary
  - 3–5 targeted questions to ask your doctor
  - What to bring checklist (records, medication list, symptom timeline)
  - Personal symptom scratchpad
  - One-click **Copy Checklist** and **Print Checklist**
- **Zero-Friction Demo Mode:** Pre-loaded with two consecutive fictional lab reports clearly labeled `"Demo data — fictional"`, enabling immediate end-to-end judging without requiring personal health data.
- **Privacy First (Local-Only Storage):** All reports, notes, and comparisons are stored strictly within the user's browser `localStorage`. No cloud database tracking.

---

## 5. How It Works (User Flow)

```
       [ Medical Report ]
(PDF / Image / TXT / Text Paste / Demo)
              │
              ▼
   [ Structured Extraction ]
 (Tests, Values, Units, Ranges, Status)
              │
              ▼
    [ AI Report Explanation ]
(What stands out • What it measures • Plain explanation • Doctor questions)
              │
              ▼
   [ Multi-Report Comparison ]
  (Delta changes: 11.2 → 10.2 g/dL • Shift direction)
              │
              ▼
     [ Health Trends Graph ]
 (Recharts longitudinal visualization)
              │
              ▼
  [ Doctor Visit Preparation ]
(Observations • Questions to Ask • What to Bring • Copy Checklist)
```

---

## 6. Technology Stack
- **Frontend Framework:** React (Vite-powered, ES Modules)
- **Styling:** Tailwind CSS (custom healthcare teal & slate palette)
- **Icons:** Lucide React
- **Data Visualization:** Recharts (responsive SVG line charts)
- **AI Engine:** Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`)
- **Backend / Serverless:** Vercel Serverless Function (`/api/analyze.js`) + Vite local proxy middleware
- **Client Storage:** Browser `localStorage`

---

## 7. AI Usage
CareBridge AI utilizes Google Gemini's multimodal reasoning with a strict structured system prompt:
- **Schema Adherence:** Enforces a rigid JSON output format defining tests, values, units, reference intervals, and status flags.
- **Zero Hallucination Guardrails:** Prompt rules forbid inventing missing values or missing reference intervals. If information is not in the source text, it is marked as `"Unknown"`.
- **Educational Framing:** Enforces non-prescriptive, non-diagnostic clinical tone:
  - *"This result is outside the reference range shown in the report."*
  - *"This may be worth discussing with a healthcare professional."*
  - *"Interpretation depends on the individual's clinical context."*

---

## 8. Safety & Responsible AI
1. **Non-Diagnostic & Non-Prescriptive:** CareBridge AI explicitly does not diagnose diseases, prescribe medication, or instruct patients to alter treatment regimens.
2. **Prominent Safety Disclaimers:** A persistent alert banner is displayed across every screen:
   > *CareBridge AI provides educational information and is not a diagnostic or treatment tool. Medical decisions should be made with a qualified healthcare professional.*
3. **Neutral Directional Language:** Test changes are described neutrally as `Increased`, `Decreased`, or `Similar`. Changes are never labeled as inherently "safe" or "dangerous" by the AI.
4. **Distinction of Extracted Data vs. AI Insights:** The UI strictly separates raw extracted lab values from AI-generated explanations and discussion questions.
5. **Offline & Fallback Safety:** If the Gemini API is unreachable or no API key is provided, the application automatically engages a built-in heuristic parser so judges and users never experience a broken UI.

---

## 9. Project Architecture

```
carebridge-ai/
├── api/
│   └── analyze.js           # Vercel Serverless API proxy for Gemini API
├── src/
│   ├── components/
│   │   ├── ApiKeyModal.jsx      # Settings modal for custom Gemini API key
│   │   ├── ComparisonView.jsx   # Multi-report delta table & Recharts trend chart
│   │   ├── DashboardView.jsx    # Metrics, latest report card, quick actions
│   │   ├── DoctorPrepView.jsx   # Visit checklist, questions, personal notes, copy button
│   │   ├── Navbar.jsx           # Healthcare header, tab navigation, demo button
│   │   ├── ReportDetailsView.jsx# Structured biomarker table & 4-part AI explanation
│   │   ├── SafetyBanner.jsx     # Persistent non-diagnostic disclaimer
│   │   ├── TimelineView.jsx     # Chronological health timeline
│   │   └── UploadView.jsx       # File dropzone, paste fallback, demo presets
│   ├── data/
│   │   └── demoReports.js       # 2 rich fictional baseline & follow-up demo panels
│   ├── services/
│   │   ├── geminiService.js     # Handles API requests & fallback parsing
│   │   └── storageService.js    # LocalStorage persistence manager
│   ├── utils/
│   │   └── comparisonUtils.js   # Delta calculations, trend datasets, normalization
│   ├── App.jsx                  # Main application orchestrator
│   ├── index.css                # Tailwind base styles and print styles
│   └── main.jsx                 # React root mount
├── .env.example             # Template for GEMINI_API_KEY
├── index.html               # App entry HTML with healthcare branding
├── package.json             # Dependencies and build scripts
├── tailwind.config.js       # Tailwind CSS theme
├── vercel.json              # Vercel routing configuration
└── vite.config.js           # Vite configuration with local /api dev proxy
```

---

## 10. Local Setup

### Prerequisites
- Node.js (v18 or higher, tested on v24)
- npm or yarn

### Steps
1. Navigate to the project directory:
   ```bash
   cd carebridge-ai
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Set up your Gemini API key in `.env`:
   ```bash
   cp .env.example .env
   # Open .env and add your key: GEMINI_API_KEY=AIzaSy...
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:5173`.

---

## 11. Environment Variables
Create a `.env` file in the root directory:
```env
# Get a free Gemini API key from https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note:** Even without an API key, the complete hackathon workflow works out of the box using our built-in offline parser and fictional demo presets!

---

## 12. Deployment Instructions (Vercel)

CareBridge AI is pre-configured for one-click deployment on **Vercel**:
1. Push this repository to GitHub or GitLab.
2. In the Vercel Dashboard, click **Add New Project** and import the repository.
3. Configure the environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: `Your_Google_Gemini_API_Key`
4. Click **Deploy**. Vercel will automatically build the React frontend and deploy `/api/analyze.js` as a secure Serverless Function.

---

## 13. Demo Instructions (Hackathon Judging Walkthrough)

To verify the end-to-end user flow:
1. Open **CareBridge AI**.
2. Click the prominent **"Try Demo Report"** button in the header or dashboard.
3. **Step 1 (Baseline Report):** Notice Fictional Demo Report 1 loads (October 12, 2025). Review:
   - Structured biomarkers table (`Hemoglobin = 11.2 g/dL [Low]`, `Glucose = 108 mg/dL [High]`, `Total Cholesterol = 215 mg/dL [High]`).
   - The 4-part AI explanation (*What stands out*, *What it measures*, *Plain explanation*, *Questions to discuss*).
4. **Step 2 (Follow-up Comparison):** Click **"Compare & Trends"** in the top navigation.
   - Observe side-by-side biomarker comparison between Baseline (Oct 12) and Follow-up (Nov 18).
   - See the exact delta: `Hemoglobin 11.2 → 10.2 g/dL (Change: -1.0 g/dL, Decreased)`.
   - Select **Hemoglobin** or **Fasting Blood Glucose** from the dropdown to see the interactive **Recharts Trend Line**.
5. **Step 3 (Doctor Visit Preparation):** Click **"Doctor Visit Prep"**.
   - Review auto-synthesized **Key Observations** from both reports.
   - Check off interactive **Questions to Ask** and **Information to Bring**.
   - Add personal symptoms or concerns into the notes scratchpad.
   - Click **"Copy Checklist"** to copy the formatted agenda to your clipboard (or click **"Print Checklist"**).

---

## 14. Future Improvements
- **Direct EHR / FHIR Integration:** Import structured lab results directly from Apple Health, Epic MyChart, or Cerner.
- **Multilingual Patient Translation:** Generate doctor preparation checklists and explanations in Spanish, Mandarin, Hindi, and Arabic.
- **Medication Interaction Cross-Reference:** Provide educational questions when lab changes correlate with known medication adjustments.
- **Voice-Guided Doctor Prep:** Audio playback of generated questions for patients with low vision or limited digital literacy.
- **Wearable Device Correlation:** Overlay continuous glucose monitoring (CGM) or heart rate variability (HRV) onto blood lab trend lines.

---

*CareBridge AI — Educational Health Report Understanding & Doctor-Visit Preparation Prototype.*
