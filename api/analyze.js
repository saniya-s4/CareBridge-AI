// Vercel Serverless Function & Local Dev Handler: /api/analyze
// Securely proxies multimodal requests to Gemini API without exposing API keys

import fs from 'fs';
import path from 'path';

/**
 * Safely resolves the Gemini API key from environment, header, or .env file
 */
function resolveApiKey(req) {
  // 1. Client header override
  if (req.headers && req.headers['x-gemini-key']) {
    return req.headers['x-gemini-key'].trim();
  }

  // 2. Process environment variable
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    return process.env.GEMINI_API_KEY.trim();
  }

  // 3. Failsafe: read from .env if present in workspace root
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/GEMINI_API_KEY=([^\r\n]+)/);
      if (match && match[1] && match[1].trim()) {
        const key = match[1].trim();
        process.env.GEMINI_API_KEY = key;
        return key;
      }
    }
  } catch (err) {
    console.warn('[CareBridge API] Could not read .env file:', err.message);
  }

  return null;
}

function resolveModel() {
  return process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-gemini-key'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { reportText, reportDate, reportTitle, imageBase64, imageMimeType, detectedFileType } = req.body || {};

  const hasImage = Boolean(imageBase64 && typeof imageBase64 === 'string');
  const hasText = Boolean(reportText && typeof reportText === 'string' && reportText.trim());

  if (!hasImage && !hasText) {
    console.warn('[CareBridge API Warning] Neither imageBase64 nor reportText was provided.');
    return res.status(400).json({
      error: 'Either report text or a medical report image is required.',
      errorType: 'MISSING_PAYLOAD'
    });
  }

  const apiKey = resolveApiKey(req);
  const model = resolveModel();

  if (!apiKey) {
    console.error('[CareBridge API Error] MISSING_API_KEY: GEMINI_API_KEY is not configured on server or in .env.');
    return res.status(401).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please check your .env file or configure via Settings.',
      errorType: 'MISSING_API_KEY',
      debugInfo: {
        detectedFileType: detectedFileType || (hasImage ? (imageMimeType || 'image/jpeg') : 'text/plain'),
        imageConverted: hasImage,
        geminiResponseReceived: false,
        parsedTestCount: 0
      }
    });
  }

  const systemInstruction = `You are CareBridge AI, an expert medical document and clinical lab report analysis system.
You do NOT diagnose medical conditions, do NOT prescribe treatments, and do NOT make definitive medical claims.

Your task is to analyze the provided medical document (${hasImage ? 'medical report image' : 'medical text'}).

Carefully examine every visible section, table, test name, result value, unit, and reference interval.

CRITICAL MEDICAL EXTRACTION RULES:
1. NEVER invent or hallucinate test names, values, units, or reference ranges.
2. NEVER assume or invent a reference range. If not visible in the document, return "Unknown".
3. If any test value or reference interval is unclear or partially occluded, return "Unknown" instead of guessing.
4. Extract values EXACTLY as visible in the report (e.g. 10.2, 108, <0.05, Negative).
5. Handle tabular layouts accurately: match each row's test name with its corresponding result value, unit, reference interval, and flag.
6. For status, assign strictly:
   - "High" (if lab flagged as High, H, or value is above the upper reference limit)
   - "Low" (if lab flagged as Low, L, or value is below the lower reference limit)
   - "Normal" (if lab flagged as Normal or value is within reference range)
   - "Unknown" (if no reference range is provided or status cannot be determined)
7. CLASSIFY THE DOCUMENT:
   - "Laboratory Report": blood tests, urinalysis, metabolic panels, lipid panels, pathology tables.
   - "Prescription": outpatient prescription with drug names, dosages, and administration schedules.
   - "Clinical Note": doctor consultation notes, discharge summary, or progress note.
   - "Other / Unknown": administrative or unclear documents.
8. If the document is a Prescription or Clinical Note, DO NOT force medications into the "tests" array. Leave "tests" as [] and populate "clinicalInfo.medications".
9. For all documents, generate educational 4-part explanation and 3 to 5 doctor visit questions.

Strictly output a single JSON object matching this schema:
{
  "reportTitle": "string",
  "reportType": "Laboratory Report | Prescription | Clinical Note | Imaging Report | Other / Unknown",
  "patient": {
    "name": "string or Unknown",
    "date": "YYYY-MM-DD or Date unavailable or Unknown"
  },
  "tests": [
    {
      "testName": "string",
      "value": "number or string",
      "unit": "string or Unknown",
      "referenceRange": "string or Unknown",
      "status": "Normal | High | Low | Unknown",
      "category": "string (e.g. Hematology, Metabolic, Kidney Function, Lipid Panel, Electrolytes, General)",
      "biologicalRole": "string (1 brief educational sentence explaining what this test measures)"
    }
  ],
  "clinicalInfo": {
    "diagnosesOrIndications": ["string"],
    "medications": [
      {
        "name": "string",
        "dosage": "string",
        "frequency": "string",
        "instructions": "string"
      }
    ],
    "clinicalObservations": ["string"]
  },
  "explanation": {
    "standsOut": "string",
    "testMeasures": "string",
    "simpleExplanation": "string",
    "doctorQuestions": [
      "string",
      "string",
      "string"
    ]
  }
}`;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const parts = [];

    // Multimodal Image Part
    if (hasImage) {
      const mime = imageMimeType || 'image/jpeg';
      parts.push({
        inlineData: {
          mimeType: mime,
          data: imageBase64
        }
      });
      console.log(`[CareBridge API] Attaching image part: MIME=${mime}, Base64Length=${imageBase64.length}`);
    }

    // Text instructions & optional supplementary notes
    const textPrompt = hasText
      ? `${systemInstruction}\n\nSUPPLEMENTARY USER TEXT / NOTES:\nTitle: ${reportTitle || 'Unknown'}\nDate: ${reportDate || 'Unknown'}\nReport Text Content:\n"""\n${reportText}\n"""`
      : `${systemInstruction}\n\nDOCUMENT METADATA (if known):\nTitle: ${reportTitle || 'Unknown'}\nDate: ${reportDate || 'Unknown'}`;

    parts.push({ text: textPrompt });

    console.log(`[CareBridge API] Dispatching multimodal request to Gemini model: ${model}`);

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const rawMsg = errorData.error?.message || `HTTP ${response.status}`;

      let errorType = 'API_FAILURE';
      if (response.status === 400) {
        errorType = 'INVALID_MODEL_OR_REQUEST';
        console.error(`[CareBridge API Error] INVALID_MODEL_OR_REQUEST (${response.status}):`, rawMsg);
      } else if (response.status === 401 || response.status === 403) {
        errorType = 'AUTHENTICATION_ERROR';
        console.error(`[CareBridge API Error] AUTHENTICATION_ERROR (${response.status}):`, rawMsg);
      } else if (response.status === 429) {
        errorType = 'RATE_LIMIT';
        console.error(`[CareBridge API Error] RATE_LIMIT (${response.status}):`, rawMsg);
      } else {
        console.error(`[CareBridge API Error] API_FAILURE (${response.status}):`, rawMsg);
      }

      return res.status(response.status).json({
        error: `Gemini API returned error (${response.status}): ${rawMsg}`,
        errorType,
        debugInfo: {
          detectedFileType: detectedFileType || (hasImage ? imageMimeType : 'text/plain'),
          imageConverted: hasImage,
          geminiResponseReceived: false,
          parsedTestCount: 0
        }
      });
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      console.error('[CareBridge API Error] MALFORMED_RESPONSE: Empty candidates returned from Gemini API.');
      return res.status(502).json({
        error: 'Empty response received from Gemini API.',
        errorType: 'MALFORMED_RESPONSE',
        debugInfo: {
          detectedFileType: detectedFileType || (hasImage ? imageMimeType : 'text/plain'),
          imageConverted: hasImage,
          geminiResponseReceived: true,
          parsedTestCount: 0
        }
      });
    }

    // Parse JSON safely
    let parsed;
    try {
      const cleaned = candidateText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('[CareBridge API Error] MALFORMED_RESPONSE: Failed to parse candidate as JSON:', parseErr.message);
      return res.status(502).json({
        error: 'Failed to parse Gemini output into structured medical JSON.',
        errorType: 'MALFORMED_RESPONSE',
        rawOutput: candidateText.slice(0, 400),
        debugInfo: {
          detectedFileType: detectedFileType || (hasImage ? imageMimeType : 'text/plain'),
          imageConverted: hasImage,
          geminiResponseReceived: true,
          parsedTestCount: 0
        }
      });
    }

    const testList = Array.isArray(parsed.tests) ? parsed.tests : [];
    console.log(`[CareBridge API Success] Gemini extracted ${testList.length} tests. Document classified as "${parsed.reportType}".`);

    // Attach server debug telemetry
    parsed.debugInfo = {
      detectedFileType: detectedFileType || (hasImage ? imageMimeType : 'text/plain'),
      imageConverted: hasImage,
      geminiResponseReceived: true,
      parsedTestCount: testList.length,
      reportType: parsed.reportType || 'Unknown',
      modelUsed: model
    };

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('[CareBridge API Error] NETWORK_OR_SYSTEM_FAILURE:', err);
    return res.status(500).json({
      error: 'Failed to communicate with Gemini API: ' + (err.message || 'Network error'),
      errorType: 'SYSTEM_FAILURE',
      debugInfo: {
        detectedFileType: detectedFileType || (hasImage ? imageMimeType : 'text/plain'),
        imageConverted: hasImage,
        geminiResponseReceived: false,
        parsedTestCount: 0
      }
    });
  }
}
