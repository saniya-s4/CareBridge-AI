// Utilities for comparing medical reports and generating trend datasets

/**
 * Standardize test names for matching across reports
 */
export function normalizeTestName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/^(total|fasting|serum)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Compare two reports and match common tests
 * @param {Object} prevReport - Earlier report
 * @param {Object} latestReport - Newer report
 * @returns {Array} Comparison rows
 */
export function compareReports(prevReport, latestReport) {
  if (!prevReport || !latestReport) return [];

  const prevTests = prevReport.tests || prevReport.structuredTests || [];
  const latestTests = latestReport.tests || latestReport.structuredTests || [];

  const comparisonMap = new Map();

  // Index latest tests
  latestTests.forEach(test => {
    const norm = normalizeTestName(test.testName);
    comparisonMap.set(norm, {
      testName: test.testName,
      unit: test.unit || '',
      category: test.category || 'General',
      referenceRange: test.referenceRange || 'Unknown',
      previousValue: null,
      previousStatus: null,
      latestValue: test.value,
      latestStatus: test.status,
      change: null,
      direction: 'Unable to compare'
    });
  });

  // Match previous tests
  prevTests.forEach(pTest => {
    const norm = normalizeTestName(pTest.testName);
    if (comparisonMap.has(norm)) {
      const entry = comparisonMap.get(norm);
      entry.previousValue = pTest.value;
      entry.previousStatus = pTest.status;
      if (!entry.unit || entry.unit === 'Unknown') entry.unit = pTest.unit;
    } else {
      // Test was in previous report but missing from latest
      comparisonMap.set(norm, {
        testName: pTest.testName,
        unit: pTest.unit || '',
        category: pTest.category || 'General',
        referenceRange: pTest.referenceRange || 'Unknown',
        previousValue: pTest.value,
        previousStatus: pTest.status,
        latestValue: null,
        latestStatus: null,
        change: null,
        direction: 'Unable to compare'
      });
    }
  });

  // Calculate changes and directions
  const results = [];

  comparisonMap.forEach(item => {
    const numPrev = parseFloat(item.previousValue);
    const numLatest = parseFloat(item.latestValue);

    if (item.previousValue !== null && item.latestValue !== null && !isNaN(numPrev) && !isNaN(numLatest)) {
      const diff = numLatest - numPrev;
      const roundedDiff = Math.round(diff * 100) / 100;
      item.change = roundedDiff;

      const threshold = 0.05;
      if (roundedDiff > threshold) {
        item.direction = 'Increased';
      } else if (roundedDiff < -threshold) {
        item.direction = 'Decreased';
      } else {
        item.direction = 'Similar';
      }
    } else {
      item.direction = 'Unable to compare';
      item.change = null;
    }

    results.push(item);
  });

  // Sort: tests with comparison data first, then alphabetically
  return results.sort((a, b) => {
    if (a.previousValue !== null && a.latestValue !== null && (b.previousValue === null || b.latestValue === null)) {
      return -1;
    }
    if (b.previousValue !== null && b.latestValue !== null && (a.previousValue === null || a.latestValue === null)) {
      return 1;
    }
    return a.testName.localeCompare(b.testName);
  });
}

/**
 * Generate multi-report historical timeline points for a specific test (for Recharts)
 * @param {Array} allReports
 * @param {string} testName
 */
export function buildTestTrendData(allReports, testName) {
  if (!allReports || allReports.length === 0 || !testName) return [];

  const normTarget = normalizeTestName(testName);

  // Chronologically sort reports (earliest to newest)
  const sortedReports = [...allReports].sort((a, b) => {
    const dateA = new Date(a.date || '1970-01-01').getTime();
    const dateB = new Date(b.date || '1970-01-01').getTime();
    return dateA - dateB;
  });

  const trendPoints = [];

  sortedReports.forEach(report => {
    const testList = report.tests || report.structuredTests || [];
    const matchedTest = testList.find(
      t => normalizeTestName(t.testName) === normTarget
    );

    if (matchedTest && matchedTest.value !== undefined && matchedTest.value !== null) {
      const numVal = parseFloat(matchedTest.value);
      if (!isNaN(numVal)) {
        trendPoints.push({
          reportId: report.id,
          reportTitle: report.title,
          date: report.date || 'Date unavailable',
          displayDate: report.date ? new Date(report.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date N/A',
          value: numVal,
          unit: matchedTest.unit || '',
          status: matchedTest.status || 'Unknown',
          referenceRange: matchedTest.referenceRange || 'Unknown'
        });
      }
    }
  });

  return trendPoints;
}
