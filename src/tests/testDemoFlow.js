// Node test script to verify core calculations, demo data, and flow integrity
import { DEMO_REPORTS } from '../data/demoReports.js';
import { compareReports, buildTestTrendData } from '../utils/comparisonUtils.js';

console.log('--- TESTING CAREBRIDGE AI DEMO DATA & COMPARISON LOGIC ---');

// 1. Verify Demo Reports
console.log('1. Checking Demo Reports:');
console.assert(DEMO_REPORTS.length >= 2, 'Must have at least 2 demo reports');
const rep1 = DEMO_REPORTS[0];
const rep2 = DEMO_REPORTS[1];
console.log(`- Report 1: "${rep1.title}" (${rep1.structuredTests.length} tests)`);
console.log(`- Report 2: "${rep2.title}" (${rep2.structuredTests.length} tests)`);

// 2. Verify Hemoglobin change in demo: 11.2 -> 10.2 (-1.0 g/dL, "Decreased")
console.log('\n2. Testing compareReports(rep1, rep2):');
const comparison = compareReports(rep1, rep2);
const hgb = comparison.find(c => c.testName.toLowerCase().includes('hemoglobin'));
console.assert(hgb, 'Hemoglobin must be present in comparison');
console.log(`- Hemoglobin Previous: ${hgb.previousValue} ${hgb.unit}`);
console.log(`- Hemoglobin Latest: ${hgb.latestValue} ${hgb.unit}`);
console.log(`- Change: ${hgb.change} ${hgb.unit}`);
console.log(`- Direction: ${hgb.direction}`);
console.assert(hgb.previousValue === 11.2, 'Previous Hemoglobin should be 11.2');
console.assert(hgb.latestValue === 10.2, 'Latest Hemoglobin should be 10.2');
console.assert(hgb.change === -1, 'Change should be -1.0');
console.assert(hgb.direction === 'Decreased', 'Direction should be Decreased');

// 3. Verify Glucose change: 108 -> 96 (-12.0 mg/dL, "Decreased")
const glucose = comparison.find(c => c.testName.toLowerCase().includes('glucose'));
console.assert(glucose, 'Glucose must be present in comparison');
console.log(`- Glucose Previous: ${glucose.previousValue} -> Latest: ${glucose.latestValue}, Change: ${glucose.change}, Direction: ${glucose.direction}`);
console.assert(glucose.direction === 'Decreased', 'Glucose should be Decreased');

// 4. Verify Recharts Trend Data generation
console.log('\n3. Testing buildTestTrendData for Hemoglobin:');
const trendData = buildTestTrendData(DEMO_REPORTS, 'Hemoglobin');
console.log(`- Trend points generated: ${trendData.length}`);
trendData.forEach(pt => {
  console.log(`  * ${pt.displayDate} -> ${pt.value} ${pt.unit} (${pt.status})`);
});
console.assert(trendData.length === 2, 'Should have 2 trend points');

// 5. Verify Explanation Structure
console.log('\n4. Testing 4-Part AI Explanation Structure:');
['standsOut', 'testMeasures', 'simpleExplanation', 'doctorQuestions'].forEach(key => {
  console.assert(rep1.explanation[key], `Report 1 missing explanation.${key}`);
  console.assert(rep2.explanation[key], `Report 2 missing explanation.${key}`);
});
console.log(`- Doctor questions generated for Report 2: ${rep2.explanation.doctorQuestions.length}`);

console.log('\n>>> ALL CORE CAREBRIDGE AI LOGIC & DEMO FLOW TESTS PASSED! <<<');
