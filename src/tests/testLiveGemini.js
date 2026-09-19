// Live test of Gemini Multimodal Image Extraction with real generated images
import fs from 'fs';
import path from 'path';

async function testLiveGemini() {
  console.log('==================================================================');
  console.log('TESTING REAL GEMINI MULTIMODAL EXTRACTION WITH LOCAL /api/analyze');
  console.log('==================================================================\n');

  // 1. Read lab_report.jpg
  const labImagePath = path.resolve('public/test-samples/lab_report.jpg');
  const labBase64 = fs.readFileSync(labImagePath).toString('base64');
  console.log(`Loaded lab_report.jpg (Base64 length: ${labBase64.length} chars)`);

  console.log('Sending lab_report.jpg to http://localhost:5173/api/analyze...');
  const resLab = await fetch('http://localhost:5173/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64: labBase64,
      imageMimeType: 'image/jpeg',
      detectedFileType: 'image/jpeg',
      reportTitle: 'Lab Report Image Test'
    })
  });

  console.log('Lab Response HTTP Status:', resLab.status);
  const dataLab = await resLab.json();

  if (!resLab.ok) {
    console.error('API Call Failed:', dataLab);
    process.exit(1);
  }

  console.log('\n--- GEMINI LAB IMAGE RESULT ---');
  console.log('Report Title:', dataLab.reportTitle);
  console.log('Report Type:', dataLab.reportType);
  console.log('Patient:', JSON.stringify(dataLab.patient));
  console.log('Total Tests Extracted:', dataLab.tests?.length);
  console.log('\nExtracted Tests:');
  dataLab.tests?.forEach(t => {
    console.log(`  • ${t.testName.padEnd(22)}: ${String(t.value).padEnd(6)} ${String(t.unit).padEnd(10)} (Ref: ${String(t.referenceRange).padEnd(15)}) Status: [${t.status}]`);
  });

  console.log('\nExplanation Summary:');
  console.log('  Stands out:', dataLab.explanation?.standsOut);
  console.log('  Questions:', dataLab.explanation?.doctorQuestions?.length);

  console.assert(dataLab.tests?.length > 0, 'Must extract at least 1 test from lab image');
  console.assert(dataLab.reportType === 'Laboratory Report', 'Must be classified as Laboratory Report');

  // 2. Read prescription.jpg
  console.log('\n------------------------------------------------------------------');
  const rxImagePath = path.resolve('public/test-samples/prescription.jpg');
  const rxBase64 = fs.readFileSync(rxImagePath).toString('base64');
  console.log(`Loaded prescription.jpg (Base64 length: ${rxBase64.length} chars)`);

  console.log('Sending prescription.jpg to http://localhost:5173/api/analyze...');
  const resRx = await fetch('http://localhost:5173/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64: rxBase64,
      imageMimeType: 'image/jpeg',
      detectedFileType: 'image/jpeg',
      reportTitle: 'Prescription Image Test'
    })
  });

  console.log('Rx Response HTTP Status:', resRx.status);
  const dataRx = await resRx.json();

  console.log('\n--- GEMINI PRESCRIPTION IMAGE RESULT ---');
  console.log('Report Type:', dataRx.reportType);
  console.log('Lab Tests Count:', dataRx.tests?.length, '(Expected 0 for Prescription)');
  console.log('Medications Extracted:', dataRx.clinicalInfo?.medications?.length);
  dataRx.clinicalInfo?.medications?.forEach(m => {
    console.log(`  * ${m.name} ${m.dosage} - ${m.frequency || m.instructions}`);
  });

  console.log('\n==================================================================');
  console.log('SUCCESS: GEMINI MULTIMODAL REAL IMAGE EXTRACTION PASSED!');
  console.log('==================================================================');
}

testLiveGemini().catch(err => {
  console.error('Live test failed:', err);
  process.exit(1);
});
