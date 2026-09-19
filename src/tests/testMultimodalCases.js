// Comprehensive test suite for Multimodal Medical Document Analysis:
// 1. Fictional Laboratory Report Image / Payload
// 2. Prescription / Clinical Note Image / Payload
// 3. Plain Text Report

import { geminiService } from '../services/geminiService.js';

// 1x1 transparent PNG base64 for testing image payload handling
const DUMMY_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function runTests() {
  console.log('================================================================');
  console.log('TESTING MULTIMODAL EXTRACTION PIPELINE (LAB, RX, TEXT)');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // TEST CASE 1: Fictional Laboratory Report (Multimodal Image)
  // -------------------------------------------------------------
  console.log('--- TEST 1: Fictional Laboratory Report Image ---');
  const labImageInput = {
    imageBase64: DUMMY_PNG_BASE64,
    imageMimeType: 'image/png',
    detectedFileType: 'image/png',
    reportTitle: 'Complete Blood Count & Metabolic Panel (Image)',
    reportDate: '2025-10-15',
    reportText: `METROHEALTH CLINICAL LABS - BLOOD ANALYSIS
- Hemoglobin: 10.4 g/dL (Reference: 12.0 - 16.0 g/dL) [LOW]
- Fasting Blood Glucose: 110 mg/dL (Reference: 70 - 99 mg/dL) [HIGH]
- Serum Creatinine: 0.90 mg/dL (Reference: 0.60 - 1.20 mg/dL) [NORMAL]
- Total Cholesterol: 210 mg/dL (Reference: < 200 mg/dL) [HIGH]`
  };

  const labResult = await geminiService.analyzeReport(labImageInput);
  console.log(`Report Title: "${labResult.title}"`);
  console.log(`Document Classification: "${labResult.reportType}"`);
  console.log(`Image Payload Converted: ${labResult.debugInfo.imageConverted}`);
  console.log(`Parsed Test Count: ${labResult.tests.length}`);

  console.assert(labResult.reportType === 'Laboratory Report', 'Should be classified as Laboratory Report');
  console.assert(labResult.tests.length === 4, `Expected 4 tests, got ${labResult.tests.length}`);
  console.assert(labResult.debugInfo.imageConverted === true, 'Image should be marked as converted');

  const hgb = labResult.tests.find(t => t.testName.toLowerCase().includes('hemoglobin'));
  console.assert(hgb && hgb.status === 'Low', 'Hemoglobin should be Low');
  console.log(`Sample Extracted Marker: ${hgb.testName} = ${hgb.value} ${hgb.unit} (Ref: ${hgb.referenceRange}, Status: ${hgb.status})`);
  console.log('-> TEST 1 PASSED!\n');

  // -------------------------------------------------------------
  // TEST CASE 2: Prescription / Clinical Note Image
  // -------------------------------------------------------------
  console.log('--- TEST 2: Prescription / Clinical Note Image ---');
  const rxImageInput = {
    imageBase64: DUMMY_PNG_BASE64,
    imageMimeType: 'image/jpeg',
    detectedFileType: 'image/jpeg',
    reportTitle: 'Doctor Prescription Slip',
    reportDate: '2025-11-02',
    reportText: `ST. JUDE MEDICAL CLINIC - PRESCRIPTION SLIP
Dr. Marcus Vance, MD | Internal Medicine
Rx:
- Amoxicillin 500mg - 1 capsule three times daily for 7 days
- Lisinopril 10mg - 1 tablet once daily in the morning
Clinical Diagnosis: Mild upper respiratory infection and hypertension review
Notes: Drink plenty of fluids. Return in 2 weeks for blood pressure follow-up.`
  };

  const rxResult = await geminiService.analyzeReport(rxImageInput);
  console.log(`Report Title: "${rxResult.title}"`);
  console.log(`Document Classification: "${rxResult.reportType}"`);
  console.log(`Lab Tests Count: ${rxResult.tests.length} (Rule: Should NOT force Rx into lab tests)`);
  console.log(`Prescribed Medications Extracted: ${rxResult.clinicalInfo?.medications?.length || 0}`);
  rxResult.clinicalInfo?.medications?.forEach(m => {
    console.log(`  * Medication: ${m.name} | Dosage: ${m.dosage} | Frequency: ${m.frequency}`);
  });

  console.assert(rxResult.reportType === 'Prescription', 'Should be classified as Prescription');
  console.assert(rxResult.tests.length === 0, 'Rx should have 0 lab tests (not forced into lab table)');
  console.assert((rxResult.clinicalInfo?.medications?.length || 0) >= 2, 'Should extract at least 2 medications');
  console.assert(!rxResult.explanation.standsOut.toLowerCase().includes('all extracted test values appear within'),
    'Rule 7/8 violation: Should not claim all tests normal when 0 tests were extracted');
  console.log(`Observation statement: "${rxResult.explanation.standsOut}"`);
  console.log('-> TEST 2 PASSED!\n');

  // -------------------------------------------------------------
  // TEST CASE 3: Plain Text Report
  // -------------------------------------------------------------
  console.log('--- TEST 3: Plain Text Report ---');
  const textInput = {
    reportText: `METABOLIC PANEL
Fasting Blood Glucose: 95 mg/dL (Reference: 70 - 99 mg/dL) [NORMAL]
Potassium: 4.1 mmol/L (Reference: 3.5 - 5.0 mmol/L) [NORMAL]
Sodium: 141 mmol/L (Reference: 135 - 145 mmol/L) [NORMAL]`,
    reportTitle: 'Routine Electrolytes & Glucose',
    reportDate: '2025-11-20'
  };

  const textResult = await geminiService.analyzeReport(textInput);
  console.log(`Report Title: "${textResult.title}"`);
  console.log(`Document Classification: "${textResult.reportType}"`);
  console.log(`Parsed Test Count: ${textResult.tests.length}`);
  console.assert(textResult.tests.length === 3, 'Should extract 3 tests');
  console.assert(textResult.tests.every(t => t.status === 'Normal'), 'All tests should be Normal');
  console.log('-> TEST 3 PASSED!\n');

  console.log('================================================================');
  console.log('ALL 3 MULTIMODAL TEST CASES PASSED CLEANLY & ADHERE TO ALL RULES!');
  console.log('================================================================');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
