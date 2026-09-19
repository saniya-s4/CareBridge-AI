// Fictional Demo Reports for CareBridge AI
// Clearly labeled as fictional demo data for hackathon evaluation

export const DEMO_REPORTS = [
  {
    id: 'demo-report-1',
    title: 'Comprehensive Metabolic & CBC Panel (Baseline)',
    date: '2025-10-12',
    labName: 'MetroHealth Diagnostics (Fictional Demo Lab)',
    patientName: 'Alex Morgan (Demo Patient)',
    isDemo: true,
    rawText: `METROHEALTH CLINICAL DIAGNOSTICS - FICTIONAL DEMO REPORT
Patient: Alex Morgan | DOB: 1988-04-12 | Sex: F
Specimen Date: 2025-10-12 | Order: Dr. E. Bennett (Internal Medicine)
Status: Final Completed

COMPLETE BLOOD COUNT (CBC):
- Hemoglobin: 11.2 g/dL (Reference: 12.0 - 16.0 g/dL) [LOW]
- Hematocrit: 34.0 % (Reference: 36.0 - 46.0 %) [LOW]
- White Blood Cell (WBC): 6.8 x10^3/uL (Reference: 4.5 - 11.0 x10^3/uL) [NORMAL]
- Platelet Count: 245 x10^3/uL (Reference: 150 - 450 x10^3/uL) [NORMAL]
- Serum Ferritin: 18 ng/mL (Reference: 20 - 200 ng/mL) [LOW]

COMPREHENSIVE METABOLIC PANEL (CMP):
- Fasting Blood Glucose: 108 mg/dL (Reference: 70 - 99 mg/dL) [HIGH]
- Serum Creatinine: 0.95 mg/dL (Reference: 0.60 - 1.20 mg/dL) [NORMAL]
- Blood Urea Nitrogen (BUN): 14 mg/dL (Reference: 7 - 20 mg/dL) [NORMAL]
- eGFR: 92 mL/min/1.73m2 (Reference: > 60 mL/min/1.73m2) [NORMAL]
- Total Cholesterol: 215 mg/dL (Reference: < 200 mg/dL) [HIGH]
- Potassium: 4.2 mmol/L (Reference: 3.5 - 5.0 mmol/L) [NORMAL]
- Sodium: 140 mmol/L (Reference: 135 - 145 mmol/L) [NORMAL]

Note: This is simulated demo data intended for educational demonstration of CareBridge AI.`,
    structuredTests: [
      {
        testName: 'Hemoglobin',
        value: 11.2,
        unit: 'g/dL',
        referenceRange: '12.0 - 16.0 g/dL',
        status: 'Low',
        category: 'Hematology',
        description: 'Hemoglobin is an iron-rich protein in red blood cells that carries oxygen from the lungs to the rest of the body.'
      },
      {
        testName: 'Hematocrit',
        value: 34.0,
        unit: '%',
        referenceRange: '36.0 - 46.0 %',
        status: 'Low',
        category: 'Hematology',
        description: 'Hematocrit measures the percentage of whole blood volume made up of red blood cells.'
      },
      {
        testName: 'White Blood Cell (WBC)',
        value: 6.8,
        unit: 'x10^3/uL',
        referenceRange: '4.5 - 11.0 x10^3/uL',
        status: 'Normal',
        category: 'Hematology',
        description: 'White blood cells are an essential part of the immune system that defend against infections.'
      },
      {
        testName: 'Platelet Count',
        value: 245,
        unit: 'x10^3/uL',
        referenceRange: '150 - 450 x10^3/uL',
        status: 'Normal',
        category: 'Hematology',
        description: 'Platelets are cell fragments that play a critical role in blood clotting to stop bleeding.'
      },
      {
        testName: 'Serum Ferritin',
        value: 18,
        unit: 'ng/mL',
        referenceRange: '20 - 200 ng/mL',
        status: 'Low',
        category: 'Hematology / Iron',
        description: 'Serum ferritin reflects the body’s total stored iron reserves.'
      },
      {
        testName: 'Fasting Blood Glucose',
        value: 108,
        unit: 'mg/dL',
        referenceRange: '70 - 99 mg/dL',
        status: 'High',
        category: 'Metabolic',
        description: 'Measures blood sugar concentration after a period of fasting.'
      },
      {
        testName: 'Serum Creatinine',
        value: 0.95,
        unit: 'mg/dL',
        referenceRange: '0.60 - 1.20 mg/dL',
        status: 'Normal',
        category: 'Kidney Function',
        description: 'A waste product from muscle breakdown filtered by the kidneys, used to assess kidney function.'
      },
      {
        testName: 'Blood Urea Nitrogen (BUN)',
        value: 14,
        unit: 'mg/dL',
        referenceRange: '7 - 20 mg/dL',
        status: 'Normal',
        category: 'Kidney Function',
        description: 'Measures the amount of urea nitrogen in the blood, reflecting kidney and liver metabolism.'
      },
      {
        testName: 'eGFR',
        value: 92,
        unit: 'mL/min/1.73m2',
        referenceRange: '> 60 mL/min/1.73m2',
        status: 'Normal',
        category: 'Kidney Function',
        description: 'Estimated Glomerular Filtration Rate estimates how effectively the kidneys filter waste.'
      },
      {
        testName: 'Total Cholesterol',
        value: 215,
        unit: 'mg/dL',
        referenceRange: '< 200 mg/dL',
        status: 'High',
        category: 'Lipid Panel',
        description: 'Measures overall cholesterol in blood, including both LDL and HDL fractions.'
      },
      {
        testName: 'Potassium',
        value: 4.2,
        unit: 'mmol/L',
        referenceRange: '3.5 - 5.0 mmol/L',
        status: 'Normal',
        category: 'Electrolytes',
        description: 'An essential electrolyte that supports muscle contractions and cardiac electrical rhythms.'
      },
      {
        testName: 'Sodium',
        value: 140,
        unit: 'mmol/L',
        referenceRange: '135 - 145 mmol/L',
        status: 'Normal',
        category: 'Electrolytes',
        description: 'A major electrolyte balancing fluid levels, nerve impulses, and muscle function.'
      }
    ],
    explanation: {
      standsOut: 'Hemoglobin (11.2 g/dL), Hematocrit (34.0%), and Serum Ferritin (18 ng/mL) are below the reference ranges indicated on the report. Fasting Blood Glucose (108 mg/dL) and Total Cholesterol (215 mg/dL) are slightly above standard reference limits. Kidney function markers and white cell counts are within standard ranges.',
      testMeasures: 'This combined panel evaluates two primary areas: Hematology (red blood cells and iron storage markers that deliver oxygen throughout your body) and Metabolic Health (blood glucose regulation, kidney filtration, and lipid balance).',
      simpleExplanation: 'Your red blood cell markers and iron storage (ferritin) are below the lab’s reference thresholds, which often prompts doctors to review dietary iron intake, absorption, or routine blood loss. Additionally, your fasting blood sugar and cholesterol are slightly higher than standard target thresholds. These values do not constitute a diagnosis, as interpretation depends heavily on individual medical history, diet, and clinical context.',
      doctorQuestions: [
        'How do these slightly low hemoglobin and ferritin levels relate to my current daily energy and nutrition?',
        'Do you recommend any dietary adjustments or supplementary tests for iron levels?',
        'What lifestyle or dietary strategies would you suggest to keep my fasting glucose and cholesterol in target ranges?',
        'When would you recommend repeating these tests to monitor trends?'
      ]
    }
  },
  {
    id: 'demo-report-2',
    title: 'Follow-up Metabolic & CBC Panel (5 Weeks Later)',
    date: '2025-11-18',
    labName: 'MetroHealth Diagnostics (Fictional Demo Lab)',
    patientName: 'Alex Morgan (Demo Patient)',
    isDemo: true,
    rawText: `METROHEALTH CLINICAL DIAGNOSTICS - FICTIONAL DEMO REPORT
Patient: Alex Morgan | DOB: 1988-04-12 | Sex: F
Specimen Date: 2025-11-18 | Order: Dr. E. Bennett (Internal Medicine)
Status: Final Completed - Follow-up Evaluation

COMPLETE BLOOD COUNT (CBC):
- Hemoglobin: 10.2 g/dL (Reference: 12.0 - 16.0 g/dL) [LOW]
- Hematocrit: 31.5 % (Reference: 36.0 - 46.0 %) [LOW]
- White Blood Cell (WBC): 6.9 x10^3/uL (Reference: 4.5 - 11.0 x10^3/uL) [NORMAL]
- Platelet Count: 250 x10^3/uL (Reference: 150 - 450 x10^3/uL) [NORMAL]
- Serum Ferritin: 14 ng/mL (Reference: 20 - 200 ng/mL) [LOW]

COMPREHENSIVE METABOLIC PANEL (CMP):
- Fasting Blood Glucose: 96 mg/dL (Reference: 70 - 99 mg/dL) [NORMAL]
- Serum Creatinine: 0.96 mg/dL (Reference: 0.60 - 1.20 mg/dL) [NORMAL]
- Blood Urea Nitrogen (BUN): 13 mg/dL (Reference: 7 - 20 mg/dL) [NORMAL]
- eGFR: 91 mL/min/1.73m2 (Reference: > 60 mL/min/1.73m2) [NORMAL]
- Total Cholesterol: 198 mg/dL (Reference: < 200 mg/dL) [NORMAL]
- Potassium: 4.3 mmol/L (Reference: 3.5 - 5.0 mmol/L) [NORMAL]
- Sodium: 139 mmol/L (Reference: 135 - 145 mmol/L) [NORMAL]

Note: This is simulated demo data intended for educational demonstration of CareBridge AI.`,
    structuredTests: [
      {
        testName: 'Hemoglobin',
        value: 10.2,
        unit: 'g/dL',
        referenceRange: '12.0 - 16.0 g/dL',
        status: 'Low',
        category: 'Hematology',
        description: 'Hemoglobin is an iron-rich protein in red blood cells that carries oxygen from the lungs to the rest of the body.'
      },
      {
        testName: 'Hematocrit',
        value: 31.5,
        unit: '%',
        referenceRange: '36.0 - 46.0 %',
        status: 'Low',
        category: 'Hematology',
        description: 'Hematocrit measures the percentage of whole blood volume made up of red blood cells.'
      },
      {
        testName: 'White Blood Cell (WBC)',
        value: 6.9,
        unit: 'x10^3/uL',
        referenceRange: '4.5 - 11.0 x10^3/uL',
        status: 'Normal',
        category: 'Hematology',
        description: 'White blood cells are an essential part of the immune system that defend against infections.'
      },
      {
        testName: 'Platelet Count',
        value: 250,
        unit: 'x10^3/uL',
        referenceRange: '150 - 450 x10^3/uL',
        status: 'Normal',
        category: 'Hematology',
        description: 'Platelets are cell fragments that play a critical role in blood clotting to stop bleeding.'
      },
      {
        testName: 'Serum Ferritin',
        value: 14,
        unit: 'ng/mL',
        referenceRange: '20 - 200 ng/mL',
        status: 'Low',
        category: 'Hematology / Iron',
        description: 'Serum ferritin reflects the body’s total stored iron reserves.'
      },
      {
        testName: 'Fasting Blood Glucose',
        value: 96,
        unit: 'mg/dL',
        referenceRange: '70 - 99 mg/dL',
        status: 'Normal',
        category: 'Metabolic',
        description: 'Measures blood sugar concentration after a period of fasting.'
      },
      {
        testName: 'Serum Creatinine',
        value: 0.96,
        unit: 'mg/dL',
        referenceRange: '0.60 - 1.20 mg/dL',
        status: 'Normal',
        category: 'Kidney Function',
        description: 'A waste product from muscle breakdown filtered by the kidneys, used to assess kidney function.'
      },
      {
        testName: 'Blood Urea Nitrogen (BUN)',
        value: 13,
        unit: 'mg/dL',
        referenceRange: '7 - 20 mg/dL',
        status: 'Normal',
        category: 'Kidney Function',
        description: 'Measures the amount of urea nitrogen in the blood, reflecting kidney and liver metabolism.'
      },
      {
        testName: 'eGFR',
        value: 91,
        unit: 'mL/min/1.73m2',
        referenceRange: '> 60 mL/min/1.73m2',
        status: 'Normal',
        category: 'Kidney Function',
        description: 'Estimated Glomerular Filtration Rate estimates how effectively the kidneys filter waste.'
      },
      {
        testName: 'Total Cholesterol',
        value: 198,
        unit: 'mg/dL',
        referenceRange: '< 200 mg/dL',
        status: 'Normal',
        category: 'Lipid Panel',
        description: 'Measures overall cholesterol in blood, including both LDL and HDL fractions.'
      },
      {
        testName: 'Potassium',
        value: 4.3,
        unit: 'mmol/L',
        referenceRange: '3.5 - 5.0 mmol/L',
        status: 'Normal',
        category: 'Electrolytes',
        description: 'An essential electrolyte that supports muscle contractions and cardiac electrical rhythms.'
      },
      {
        testName: 'Sodium',
        value: 139,
        unit: 'mmol/L',
        referenceRange: '135 - 145 mmol/L',
        status: 'Normal',
        category: 'Electrolytes',
        description: 'A major electrolyte balancing fluid levels, nerve impulses, and muscle function.'
      }
    ],
    explanation: {
      standsOut: 'Fasting Blood Glucose (96 mg/dL) and Total Cholesterol (198 mg/dL) are now within standard reference ranges. However, Hemoglobin (10.2 g/dL) and Serum Ferritin (14 ng/mL) have decreased further from previous levels and remain below reference thresholds.',
      testMeasures: 'This follow-up panel tracks response in both metabolic parameters (glucose and lipid normalization) and red blood cell / iron stores over the 5-week interval.',
      simpleExplanation: 'Metabolic markers show positive change compared to the previous report, moving into standard ranges. In contrast, oxygen-carrying markers (hemoglobin and ferritin) show a downward trend over this 5-week window. This combination is an important topic to bring to your doctor to understand potential contributing factors and review your symptoms.',
      doctorQuestions: [
        'I noticed my hemoglobin decreased from 11.2 to 10.2 g/dL and ferritin from 18 to 14 ng/mL. What might explain this downward trend?',
        'Are there specific symptoms (such as fatigue, dizziness, or shortness of breath) that I should track closely?',
        'Do we need to evaluate iron absorption or order additional studies (such as an iron saturation or reticulocyte panel)?',
        'Should we schedule a follow-up test in 4–6 weeks?'
      ]
    }
  }
];
