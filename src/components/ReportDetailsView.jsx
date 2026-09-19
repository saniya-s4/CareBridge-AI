import React, { useState } from 'react';
import {
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Building2,
  User,
  Search,
  Filter,
  Sparkles,
  GitCompare,
  ClipboardList,
  ArrowRight,
  Info,
  Trash2,
  ChevronDown,
  Pill,
  FileText,
  Activity,
  Code,
  Image as ImageIcon,
  CheckCircle
} from 'lucide-react';

export default function ReportDetailsView({
  report,
  allReports,
  onSelectReport,
  onDeleteReport,
  onNavigateToCompare,
  onNavigateToDoctorPrep
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ABNORMAL' | 'NORMAL'
  const [showDebug, setShowDebug] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  if (!report) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Report Selected</h3>
        <p className="text-xs text-slate-500 mt-1">Please select or upload a report to inspect details.</p>
      </div>
    );
  }

  const tests = report.tests || report.structuredTests || [];
  const reportType = report.reportType || (tests.length > 0 ? 'Laboratory Report' : 'Clinical Note');
  const isPrescriptionOrNote = reportType === 'Prescription' || reportType === 'Clinical Note';
  const clinicalInfo = report.clinicalInfo || { medications: [] };
  const medications = clinicalInfo.medications || [];

  // Filter tests based on search and status filter
  const filteredTests = tests.filter((test) => {
    const matchesSearch = test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (test.category && test.category.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'ABNORMAL') {
      return test.status === 'High' || test.status === 'Low';
    }
    if (statusFilter === 'NORMAL') {
      return test.status === 'Normal';
    }
    return true;
  });

  const abnormalCount = tests.filter(t => t.status === 'High' || t.status === 'Low').length;
  const normalCount = tests.filter(t => t.status === 'Normal').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Report Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                reportType === 'Laboratory Report'
                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                  : reportType === 'Prescription'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-purple-50 text-purple-700 border-purple-200'
              }`}>
                {reportType}
              </span>

              {report.isDemo && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Demo data — fictional
                </span>
              )}
              {report.isFallback && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Offline Parsed
                </span>
              )}
              {report.imageBase64 && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  Multimodal Image Source
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {report.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {report.date || 'Date unavailable'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {report.labName || 'Standard Diagnostic Facility'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {report.patientName || 'Anonymous Patient'}
              </span>
            </div>
          </div>

          {/* Switch Report / Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {report.imageBase64 && (
              <button
                onClick={() => setShowImagePreview(!showImagePreview)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                {showImagePreview ? 'Hide Original Image' : 'View Original Image'}
              </button>
            )}

            {allReports.length > 1 && (
              <div className="relative">
                <select
                  value={report.id}
                  onChange={(e) => onSelectReport(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-700 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  {allReports.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.date || 'No date'})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            {allReports.length >= 2 && tests.length > 0 && (
              <button
                onClick={() => onNavigateToCompare(report.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition"
              >
                <GitCompare className="w-3.5 h-3.5" />
                Compare
              </button>
            )}

            <button
              onClick={() => onNavigateToDoctorPrep(report.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Doctor Prep
            </button>

            <button
              onClick={() => onDeleteReport(report.id)}
              title="Delete report"
              className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Image Preview Modal/Banner */}
        {showImagePreview && report.imageBase64 && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase">Original Uploaded Document Image</span>
              <button
                onClick={() => setShowImagePreview(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                ✕ Close Preview
              </button>
            </div>
            <div className="max-h-96 overflow-auto rounded-lg border border-slate-200 bg-white p-2 flex items-center justify-center">
              <img
                src={report.imageBase64}
                alt="Original Medical Document"
                className="max-w-full h-auto object-contain rounded"
              />
            </div>
          </div>
        )}

        {/* Quick Highlights Strip: Lab vs Prescription */}
        {isPrescriptionOrNote ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/60 flex items-center justify-between">
              <span className="text-xs text-indigo-800 font-medium">Prescribed Medications</span>
              <span className="text-sm font-bold text-indigo-950">{medications.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Indications / Diagnoses</span>
              <span className="text-sm font-bold text-slate-900">{clinicalInfo.diagnosesOrIndications?.length || 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/60 flex items-center justify-between">
              <span className="text-xs text-teal-800 font-medium">Document Classification</span>
              <span className="text-xs font-bold text-teal-900">{reportType}</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Total Tests Extracted</span>
              <span className="text-sm font-bold text-slate-900">{tests.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between">
              <span className="text-xs text-amber-800 font-medium">Outside Reference Range</span>
              <span className="text-sm font-bold text-amber-900">{abnormalCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between">
              <span className="text-xs text-emerald-800 font-medium">Within Reference Range</span>
              <span className="text-sm font-bold text-emerald-900">{normalCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Developer Debug Telemetry Card */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 border border-slate-800 shadow-sm text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-teal-400" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Developer Multimodal Telemetry
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-teal-500/20 text-teal-300 font-mono">
              pipeline active
            </span>
          </div>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-teal-400 hover:text-teal-300 font-semibold text-[11px]"
          >
            {showDebug ? 'Hide Details ▲' : 'Show Details ▼'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-800 text-[11px]">
          <div>
            <span className="text-slate-400 block">Detected File Type:</span>
            <span className="font-mono text-white font-semibold">{report.debugInfo?.detectedFileType || 'text/plain'}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Image Converted:</span>
            <span className={`font-mono font-semibold ${report.debugInfo?.imageConverted ? 'text-emerald-400' : 'text-slate-400'}`}>
              {report.debugInfo?.imageConverted ? 'Yes (Base64)' : 'No (Text Mode)'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Gemini Response:</span>
            <span className={`font-mono font-semibold ${report.debugInfo?.geminiResponseReceived ? 'text-emerald-400' : 'text-amber-400'}`}>
              {report.debugInfo?.geminiResponseReceived ? 'Yes (200 OK)' : 'Offline Fallback'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Parsed Test Count:</span>
            <span className="font-mono text-white font-semibold">{report.debugInfo?.parsedTestCount ?? tests.length} tests</span>
          </div>
        </div>

        {showDebug && (
          <div className="mt-3 pt-3 border-t border-slate-800 font-mono text-[10px] text-slate-300 overflow-x-auto">
            <p className="text-teal-400 mb-1">// Telemetry Payload Data:</p>
            <pre className="p-2 rounded bg-slate-950/60">{JSON.stringify({
              reportType,
              debugInfo: report.debugInfo,
              testsCount: tests.length,
              medicationsCount: medications.length
            }, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* SECTION 4: Simple Report Explanation (4-part mandated display) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Simple AI Explanation
            </h2>
            <p className="text-xs text-slate-500">
              Plain-language summary designed to facilitate thoughtful doctor visits
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* A. What stands out? */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center justify-center">
                A
              </span>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                What stands out?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
              {report.explanation?.standsOut || (tests.length === 0 ? 'No laboratory biomarkers were reliably detected in this document.' : 'Values outside established lab ranges are highlighted for review.')}
            </p>
          </div>

          {/* B. What does this test measure? */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold flex items-center justify-center">
                B
              </span>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {isPrescriptionOrNote ? 'What does this document address?' : 'What does this test measure?'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
              {report.explanation?.testMeasures || (isPrescriptionOrNote ? 'Prescribed therapeutic plan and clinical care.' : 'Assesses baseline biological and physiological functions.')}
            </p>
          </div>

          {/* C. Simple explanation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold flex items-center justify-center">
                C
              </span>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Simple Explanation
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
              {report.explanation?.simpleExplanation ||
                'This result is outside the reference range shown in the report. This may be worth discussing with a healthcare professional. Interpretation depends on the individual’s clinical context.'}
            </p>
          </div>

          {/* D. Questions to discuss with a healthcare professional */}
          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200/70 space-y-2.5 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center">
                D
              </span>
              <h3 className="text-xs font-bold text-teal-950 uppercase tracking-wider">
                Questions to Discuss with a Healthcare Professional
              </h3>
            </div>
            <ul className="space-y-2 pt-1">
              {(report.explanation?.doctorQuestions || [
                'How do these findings compare with my previous baseline health record?',
                'Are there dietary or lifestyle factors that could be influencing these results?',
                'When should we consider repeating these tests to confirm trend stability?'
              ]).map((q, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                  <span className="text-teal-600 font-bold shrink-0 mt-0.5">•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 3A: FOR PRESCRIPTIONS / CLINICAL NOTES */}
      {isPrescriptionOrNote && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Structured Clinical Information & Prescribed Medications
              </h2>
              <p className="text-xs text-slate-500">
                Extracted pharmaceutical orders and clinical observations (Non-laboratory document)
              </p>
            </div>
          </div>

          {/* Medications Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Prescribed Medications ({medications.length})
            </h3>
            {medications.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Medication Name</th>
                      <th className="py-3 px-4">Dosage</th>
                      <th className="py-3 px-4">Frequency / Schedule</th>
                      <th className="py-3 px-4">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {medications.map((med, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-indigo-950 flex items-center gap-2">
                          <Pill className="w-3.5 h-3.5 text-indigo-600" />
                          {med.name || 'Unknown Medication'}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {med.dosage || 'Standard Dosage'}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {med.frequency || 'As directed'}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {med.instructions || 'Follow doctor / pharmacist advice'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                No specific medication lines were isolated from this clinical note.
              </p>
            )}
          </div>

          {/* Clinical Indications & Observations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                Diagnoses / Indications
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(clinicalInfo.diagnosesOrIndications?.length > 0 ? clinicalInfo.diagnosesOrIndications : ['Consultation note']).map((ind, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                Clinical Observations & Advice
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(clinicalInfo.clinicalObservations?.length > 0 ? clinicalInfo.clinicalObservations : ['Routine medical follow-up']).map((obs, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3B: FOR LABORATORY REPORTS */}
      {!isPrescriptionOrNote && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Structured Lab Data Extraction
              </h2>
              <p className="text-xs text-slate-500">
                Biomarkers parsed directly from the medical document
              </p>
            </div>

            {/* Filter pills & search */}
            {tests.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search test..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs">
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({tests.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('ABNORMAL')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      statusFilter === 'ABNORMAL' ? 'bg-white text-amber-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Abnormal ({abnormalCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('NORMAL')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      statusFilter === 'NORMAL' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Normal ({normalCount})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Zero Tests Detected Alert (Rule 7 & 8) */}
          {tests.length === 0 ? (
            <div className="p-6 rounded-xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
              <h3 className="text-sm font-bold text-amber-900">
                No laboratory biomarkers were reliably detected in this document.
              </h3>
              <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
                The document may be an image of a non-laboratory record (such as an administrative bill, appointment receipt, or handwritten note), or the resolution may be unclear. You can try uploading a sharper image or pasting the lab values into the text fallback box.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Test Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Result Value</th>
                    <th className="py-3 px-4">Reference Range</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 hidden md:table-cell">Biological Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTests.length > 0 ? (
                    filteredTests.map((t, idx) => {
                      const isHigh = t.status === 'High';
                      const isLow = t.status === 'Low';
                      const isNormal = t.status === 'Normal';

                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-50/70 transition-colors ${
                            isHigh || isLow ? 'bg-amber-50/30' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {t.testName}
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-xs">
                            {t.category || 'General'}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                            {t.value}{' '}
                            <span className="text-xs font-normal text-slate-500">{t.unit !== 'Unknown' ? t.unit : ''}</span>
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                            {t.referenceRange || 'Unknown'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                isHigh
                                  ? 'bg-rose-100 text-rose-800'
                                  : isLow
                                  ? 'bg-amber-100 text-amber-800'
                                  : isNormal
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {isHigh && <TrendingUp className="w-3 h-3" />}
                              {isLow && <TrendingDown className="w-3 h-3" />}
                              {isNormal && <CheckCircle2 className="w-3 h-3" />}
                              {t.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500 max-w-xs truncate hidden md:table-cell" title={t.biologicalRole || t.description}>
                            {t.biologicalRole || t.description || 'Standard metabolic / hematologic marker.'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                        No biomarkers matched your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
