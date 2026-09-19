import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  TrendingUp,
  TrendingDown,
  Minus,
  HelpCircle,
  Calendar,
  ArrowRight,
  Sparkles,
  ArrowLeftRight,
  LineChart as LineChartIcon,
  Info,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea
} from 'recharts';
import { compareReports, buildTestTrendData } from '../utils/comparisonUtils';

export default function ComparisonView({
  reports,
  initialReportIdA,
  initialReportIdB,
  onNavigateToDoctorPrep
}) {
  // Need at least 2 reports
  if (!reports || reports.length < 2) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4">
        <GitCompare className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">
          At Least Two Reports Required for Comparison
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          To detect biomarker changes and display trend charts, CareBridge AI compares at least two consecutive lab reports.
        </p>
      </div>
    );
  }

  // Sort chronological for default selection: earliest (Report A) and newest (Report B)
  const chronological = useMemo(() => {
    return [...reports].sort((a, b) => {
      const dateA = new Date(a.date || '1970-01-01').getTime();
      const dateB = new Date(b.date || '1970-01-01').getTime();
      return dateA - dateB;
    });
  }, [reports]);

  const [reportIdA, setReportIdA] = useState(
    initialReportIdA || chronological[0]?.id
  );
  const [reportIdB, setReportIdB] = useState(
    initialReportIdB || chronological[chronological.length - 1]?.id
  );

  // Selected test for Recharts trend chart
  const [selectedTrendTest, setSelectedTrendTest] = useState('Hemoglobin');

  const reportA = reports.find(r => r.id === reportIdA) || chronological[0];
  const reportB = reports.find(r => r.id === reportIdB) || chronological[chronological.length - 1];

  // Calculate comparison rows
  const comparisons = useMemo(() => {
    return compareReports(reportA, reportB);
  }, [reportA, reportB]);

  // Available tests with numerical data for the Recharts trend
  const commonNumericTests = useMemo(() => {
    return comparisons
      .filter(c => c.previousValue !== null && c.latestValue !== null && typeof c.change === 'number')
      .map(c => c.testName);
  }, [comparisons]);

  // Ensure selected test is valid
  const activeTrendTest = commonNumericTests.includes(selectedTrendTest)
    ? selectedTrendTest
    : commonNumericTests[0] || 'Hemoglobin';

  // Build Recharts data series across all available reports
  const trendData = useMemo(() => {
    return buildTestTrendData(reports, activeTrendTest);
  }, [reports, activeTrendTest]);

  // Swap reports
  const handleSwap = () => {
    const temp = reportIdA;
    setReportIdA(reportIdB);
    setReportIdB(temp);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Multiple Report Comparison & Trends
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              {comparisons.length} Tests Compared
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Detect shifts across consecutive lab reports and visualize longitudinal biomarker trends.
          </p>
        </div>

        <button
          onClick={() => onNavigateToDoctorPrep(reportB?.id)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition shrink-0"
        >
          Prepare Doctor Questions
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Report A Selector (Earlier) */}
          <div className="flex-1 space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Previous Report (Baseline)
            </label>
            <select
              value={reportIdA}
              onChange={(e) => setReportIdA(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.date || 'Date N/A'}) {r.isDemo ? '• Fictional Demo' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center pt-3 md:pt-4">
            <button
              onClick={handleSwap}
              title="Swap report comparison order"
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Report B Selector (Follow-up) */}
          <div className="flex-1 space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Latest Report (Follow-up)
            </label>
            <select
              value={reportIdB}
              onChange={(e) => setReportIdB(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.date || 'Date N/A'}) {r.isDemo ? '• Fictional Demo' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recharts Trend Visualization Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <LineChartIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Biomarker Trend Visualization
              </h3>
              <p className="text-xs text-slate-500">
                Interactive longitudinal graph across laboratory tests
              </p>
            </div>
          </div>

          {/* Biomarker Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Select Marker:</span>
            <select
              value={activeTrendTest}
              onChange={(e) => setSelectedTrendTest(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {commonNumericTests.map((testName) => (
                <option key={testName} value={testName}>
                  {testName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart Container */}
        {trendData.length >= 2 ? (
          <div className="pt-2">
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 15, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="displayDate"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1">
                            <p className="font-bold text-teal-300">{d.reportTitle}</p>
                            <p className="text-slate-300">Date: {d.date}</p>
                            <p className="text-sm font-semibold text-white">
                              {activeTrendTest}: {d.value} {d.unit}
                            </p>
                            <p className="text-slate-400">Ref Range: {d.referenceRange}</p>
                            <p className="text-[11px] text-teal-400 font-medium">Status: {d.status}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name={activeTrendTest}
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={{ fill: '#0d9488', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, fill: '#0f766e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-2">
              <span>Reference Range shown in report: {trendData[trendData.length - 1]?.referenceRange || 'Varies by lab'}</span>
              <span>Unit: {trendData[trendData.length - 1]?.unit || 'N/A'}</span>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-xs text-slate-400">
            Insufficient numerical data points to plot a line chart for this marker.
          </div>
        )}
      </div>

      {/* Comparison Delta Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Biomarker Comparison Table
          </h3>
          <p className="text-xs text-slate-500">
            Tracking value changes between {reportA.date || 'Baseline'} and {reportB.date || 'Follow-up'}
          </p>
        </div>

        {/* Non-judgmental disclaimer reminder */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-slate-800">Neutral Observation Note:</strong> Directional flags (Increased / Decreased / Similar) indicate numerical shifts. They are not automatically labeled dangerous or safe, as clinical meaning depends on your unique diagnosis, treatments, and individual doctor consultation.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Biomarker</th>
                <th className="py-3 px-4">
                  Previous ({reportA.date || 'Report A'})
                </th>
                <th className="py-3 px-4">
                  Latest ({reportB.date || 'Report B'})
                </th>
                <th className="py-3 px-4">Shift (Delta)</th>
                <th className="py-3 px-4 text-center">Direction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisons.map((row, idx) => {
                const isIncreased = row.direction === 'Increased';
                const isDecreased = row.direction === 'Decreased';
                const isSimilar = row.direction === 'Similar';

                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{row.testName}</div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Ref: {row.referenceRange}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {row.previousValue !== null ? (
                        <>
                          <span className="font-bold">{row.previousValue}</span>{' '}
                          <span className="text-slate-500 text-xs">{row.unit}</span>
                          {row.previousStatus && (
                            <span className="ml-1 text-[10px] text-slate-400">({row.previousStatus})</span>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-400 italic">Not in report</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {row.latestValue !== null ? (
                        <>
                          <span className="font-bold">{row.latestValue}</span>{' '}
                          <span className="text-slate-500 text-xs">{row.unit}</span>
                          {row.latestStatus && (
                            <span className="ml-1 text-[10px] text-slate-400">({row.latestStatus})</span>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-400 italic">Not in report</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold whitespace-nowrap">
                      {row.change !== null ? (
                        <span className={row.change > 0 ? 'text-indigo-600' : row.change < 0 ? 'text-amber-700' : 'text-slate-600'}>
                          {row.change > 0 ? `+${row.change}` : row.change} {row.unit}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal italic">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          isIncreased
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : isDecreased
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : isSimilar
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-slate-50 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {isIncreased && <TrendingUp className="w-3 h-3" />}
                        {isDecreased && <TrendingDown className="w-3 h-3" />}
                        {isSimilar && <Minus className="w-3 h-3" />}
                        {row.direction}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
