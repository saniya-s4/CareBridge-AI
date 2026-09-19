import React from 'react';
import {
  FileText,
  Activity,
  TrendingUp,
  ClipboardCheck,
  ArrowRight,
  Sparkles,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  UploadCloud,
  ChevronRight,
  GitCompare,
  Stethoscope,
  Info
} from 'lucide-react';
import { compareReports } from '../utils/comparisonUtils';

export default function DashboardView({
  reports,
  onSelectReport,
  onNavigate,
  onRunDemo
}) {
  // Compute dashboard metrics
  const reportsCount = reports.length;

  // Collect unique tests tracked
  const allTestsSet = new Set();
  reports.forEach(r => {
    (r.structuredTests || []).forEach(t => allTestsSet.add(t.testName.toLowerCase()));
  });
  const testsTrackedCount = allTestsSet.size;

  // Sort reports chronologically
  const sortedReports = [...reports].sort((a, b) => {
    const dateA = new Date(a.date || '1970-01-01').getTime();
    const dateB = new Date(b.date || '1970-01-01').getTime();
    return dateB - dateA; // Newest first
  });

  const latestReport = sortedReports[0] || null;
  const previousReport = sortedReports[1] || null;

  // Calculate changes detected if at least 2 reports exist
  let changesDetectedCount = 0;
  if (latestReport && previousReport) {
    const comparisons = compareReports(previousReport, latestReport);
    changesDetectedCount = comparisons.filter(c => c.direction === 'Increased' || c.direction === 'Decreased').length;
  }

  // Count abnormal markers in latest report
  const latestAbnormalCount = latestReport
    ? (latestReport.structuredTests || []).filter(t => t.status === 'High' || t.status === 'Low').length
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-teal-800/30">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold tracking-wide uppercase mb-3">
            <Activity className="w-3.5 h-3.5" />
            Clinical Decision-Support Assistant
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            CareBridge AI
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
            Understand your reports. Prepare for better conversations with your doctor.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('upload')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Medical Report
            </button>
            <button
              onClick={onRunDemo}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 backdrop-blur-xs transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              Try Demo Report
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Reports Analyzed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-teal-200 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reports Analyzed</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{reportsCount}</span>
            <span className="text-xs text-slate-500">archived in browser</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {reportsCount > 0 ? `Latest: ${latestReport?.date || 'Recent'}` : 'No reports added yet'}
          </p>
        </div>

        {/* Tests Tracked */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-teal-200 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tests Tracked</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{testsTrackedCount}</span>
            <span className="text-xs text-slate-500">biomarkers</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            CBC, CMP, lipid, and renal markers
          </p>
        </div>

        {/* Changes Detected */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-teal-200 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Changes Detected</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{changesDetectedCount}</span>
            <span className="text-xs text-slate-500">shifts across panels</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {reportsCount >= 2 ? 'Compared across consecutive lab panels' : 'Add 2nd report to track changes'}
          </p>
        </div>
      </div>

      {/* Main Content Grid: Latest Report & Preparation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Report Overview (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {latestReport ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                      Latest Report
                    </span>
                    {latestReport.isDemo && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                        Demo data — fictional
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {latestReport.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {latestReport.date || 'Date unavailable'}
                    </span>
                    <span>•</span>
                    <span>{latestReport.labName || 'Diagnostic Lab'}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectReport(latestReport.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 transition"
                >
                  View Details & Explanation
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Highlight summary */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Key Highlights
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {latestReport.explanation?.standsOut || 'Report contains multiple biomarker measurements analyzed for clinical context.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sample tests extracted from this report */}
              <div className="mt-5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Sample Biomarkers ({latestReport.structuredTests?.length || 0} Total)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(latestReport.structuredTests || []).slice(0, 4).map((test, idx) => {
                    const isAbnormal = test.status === 'High' || test.status === 'Low';
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border ${
                          isAbnormal
                            ? 'bg-amber-50/50 border-amber-200/80'
                            : 'bg-slate-50/60 border-slate-200/70'
                        }`}
                      >
                        <span className="text-[11px] font-medium text-slate-500 truncate block">
                          {test.testName}
                        </span>
                        <div className="text-base font-bold text-slate-900 mt-0.5">
                          {test.value}{' '}
                          <span className="text-[10px] font-normal text-slate-500">{test.unit}</span>
                        </div>
                        <span
                          className={`inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${
                            test.status === 'High'
                              ? 'bg-rose-100 text-rose-700'
                              : test.status === 'Low'
                              ? 'bg-amber-100 text-amber-700'
                              : test.status === 'Normal'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {test.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Reports Added</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Upload your first laboratory report or test the system immediately with our fictional demo dataset.
              </p>
              <button
                onClick={onRunDemo}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load Fictional Demo Reports
              </button>
            </div>
          )}

          {/* Recent Reports Timeline List */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                Health Timeline & Recent Reports
              </h3>
              {reports.length >= 2 && (
                <button
                  onClick={() => onNavigate('compare')}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  Compare Reports
                </button>
              )}
            </div>

            <div className="space-y-3">
              {sortedReports.map((r, i) => (
                <div
                  key={r.id}
                  onClick={() => onSelectReport(r.id)}
                  className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/20 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-teal-100 text-slate-600 group-hover:text-teal-700 flex items-center justify-center font-bold text-xs transition">
                      #{sortedReports.length - i}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition">
                          {r.title}
                        </h4>
                        {r.isDemo && (
                          <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-medium border border-purple-200/50">
                            Demo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{r.date || 'Date unavailable'}</span>
                        <span>•</span>
                        <span>{r.structuredTests?.length || 0} tests tracked</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Doctor Visit Prep Sidebar Widget (1 col) */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-teal-500/10 via-white to-white rounded-2xl border border-teal-200/70 p-6 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-3 shadow-sm shadow-teal-600/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Doctor Visit Preparation
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Transform complex lab numbers into organized talking points and questions for your healthcare appointment.
            </p>

            <div className="mt-5 space-y-3">
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>3–5 tailored doctor discussion questions</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Key observations & change summary</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>What to bring checklist (records, notes)</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('doctor-prep')}
              className="w-full mt-6 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm shadow-teal-600/20"
            >
              <ClipboardCheck className="w-4 h-4" />
              Prepare For Your Visit
            </button>
          </div>

          {/* Quick Comparison Card */}
          {reports.length >= 2 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <GitCompare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Report Comparison Ready</h4>
                  <p className="text-xs text-slate-500">2 reports available to analyze trends</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                See side-by-side test differences (e.g. Hemoglobin 11.2 → 10.2 g/dL) and Recharts trend visualization.
              </p>
              <button
                onClick={() => onNavigate('compare')}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
              >
                Launch Comparison View
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
