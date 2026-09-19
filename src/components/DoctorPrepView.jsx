import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  ClipboardCheck,
  Copy,
  Check,
  AlertCircle,
  FileText,
  Calendar,
  Sparkles,
  HelpCircle,
  Briefcase,
  Printer,
  Edit3,
  CheckSquare,
  Square,
  Bookmark
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { compareReports } from '../utils/comparisonUtils';

export default function DoctorPrepView({
  reports,
  activeReportId
}) {
  const [copied, setCopied] = useState(false);
  const [checkedMap, setCheckedMap] = useState(() => storageService.getCheckedQuestions());
  const [userNotes, setUserNotes] = useState(() => storageService.getDoctorNotes());

  // Save checked map and notes to localStorage
  useEffect(() => {
    storageService.saveCheckedQuestions(checkedMap);
  }, [checkedMap]);

  useEffect(() => {
    storageService.saveDoctorNotes(userNotes);
  }, [userNotes]);

  // Sort reports newest to oldest
  const sortedReports = [...reports].sort((a, b) => {
    const dateA = new Date(a.date || '1970-01-01').getTime();
    const dateB = new Date(b.date || '1970-01-01').getTime();
    return dateB - dateA;
  });

  const latestReport = reports.find(r => r.id === activeReportId) || sortedReports[0] || null;
  const previousReport = sortedReports.find(r => r.id !== latestReport?.id) || null;

  // Build Key Observations
  let keyObservations = [];
  if (latestReport && previousReport) {
    const comparisons = compareReports(previousReport, latestReport);
    const notableChanges = comparisons.filter(c => c.direction === 'Increased' || c.direction === 'Decreased');
    if (notableChanges.length > 0) {
      keyObservations = notableChanges.map(
        c => `${c.testName}: ${c.previousValue} → ${c.latestValue} ${c.unit} (${c.direction}, ${c.change > 0 ? '+' : ''}${c.change} ${c.unit}).`
      );
    }
  }

  if (keyObservations.length === 0 && latestReport) {
    const abnormal = (latestReport.structuredTests || []).filter(t => t.status === 'High' || t.status === 'Low');
    keyObservations = abnormal.map(
      t => `${t.testName} is measured at ${t.value} ${t.unit} (Report reference range: ${t.referenceRange}), flagged as ${t.status}.`
    );
  }

  if (keyObservations.length === 0) {
    keyObservations = [
      'Values across standard panels are currently reported within established reference ranges.',
      'Discuss overall wellness and routine monitoring intervals with your physician.'
    ];
  }

  // Doctor Questions
  const questionsToAsk = latestReport?.explanation?.doctorQuestions || [
    'How do these latest test results compare with my previous baseline values?',
    'What lifestyle, nutritional, or sleep adjustments would you recommend based on these findings?',
    'Are there specific symptoms I should keep a log of before our next visit?',
    'When should we schedule follow-up blood work to verify trend stability?'
  ];

  // Information to bring
  const informationToBring = [
    { id: 'bring-1', text: 'Printed copies or digital files of previous and latest lab reports' },
    { id: 'bring-2', text: 'Up-to-date medication list (including dosages, prescriptions, and OTC supplements)' },
    { id: 'bring-3', text: 'Written timeline of symptoms (energy changes, sleep patterns, dizziness, diet)' },
    { id: 'bring-4', text: 'CareBridge AI questions checklist and personal notes' }
  ];

  const toggleCheck = (id) => {
    setCheckedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Copy entire checklist to clipboard
  const handleCopyChecklist = () => {
    let text = `=========================================\n`;
    text += `CAREBRIDGE AI - DOCTOR VISIT PREPARATION\n`;
    text += `Generated for: ${latestReport?.patientName || 'Patient'}\n`;
    text += `Report Date: ${latestReport?.date || 'Date unavailable'}\n`;
    text += `=========================================\n\n`;

    text += `KEY OBSERVATIONS FROM LAB REPORTS:\n`;
    keyObservations.forEach(obs => {
      text += `• ${obs}\n`;
    });
    text += `\n`;

    text += `QUESTIONS TO ASK YOUR HEALTHCARE PROFESSIONAL:\n`;
    questionsToAsk.forEach((q, i) => {
      const isChecked = checkedMap[`q-${i}`] ? '[X]' : '[ ]';
      text += `${isChecked} ${q}\n`;
    });
    text += `\n`;

    text += `INFORMATION TO BRING TO YOUR APPOINTMENT:\n`;
    informationToBring.forEach(item => {
      const isChecked = checkedMap[item.id] ? '[X]' : '[ ]';
      text += `${isChecked} ${item.text}\n`;
    });
    text += `\n`;

    if (userNotes.trim()) {
      text += `PERSONAL NOTES & SYMPTOMS:\n`;
      text += `${userNotes.trim()}\n\n`;
    }

    text += `DISCLAIMER: CareBridge AI provides educational health decision support and does not diagnose diseases or prescribe treatment. All medical decisions should be made with a qualified healthcare professional.\n`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.error('Clipboard copy failed:', err);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Actions */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Visit Decision Support
            </span>
            {latestReport?.isDemo && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Demo data — fictional
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Prepare for Your Doctor Visit
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Synthesized talking points, questions, and checklist based on your lab history.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="no-print px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Checklist
          </button>
          <button
            onClick={handleCopyChecklist}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm shadow-teal-600/20 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                Checklist Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Checklist
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 1: Key Observations */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
              Key Observations
            </h3>
            <p className="text-xs text-slate-500">
              Short summary of notable report shifts and flagged markers
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {keyObservations.map((obs, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5"
            >
              <span className="w-2 h-2 rounded-full bg-teal-600 mt-2 shrink-0" />
              <p className="leading-relaxed">{obs}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Questions to Ask */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                Questions to Ask
              </h3>
              <p className="text-xs text-slate-500">
                Select and prioritize questions to discuss during your appointment
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400">Click to check off</span>
        </div>

        <div className="space-y-2.5">
          {questionsToAsk.map((question, idx) => {
            const isChecked = Boolean(checkedMap[`q-${idx}`]);
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(`q-${idx}`)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isChecked
                    ? 'bg-teal-50/50 border-teal-300 text-teal-950'
                    : 'bg-white border-slate-200 hover:border-teal-200 hover:bg-slate-50/70 text-slate-800'
                }`}
              >
                <div className="mt-0.5 text-teal-600">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-teal-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-xs sm:text-sm font-medium ${isChecked ? 'line-through text-slate-400' : ''}`}>
                    {question}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Information to Bring */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
              Information to Bring
            </h3>
            <p className="text-xs text-slate-500">
              Essential records and notes that assist your clinician
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {informationToBring.map((item) => {
            const isChecked = Boolean(checkedMap[item.id]);
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                  isChecked
                    ? 'bg-indigo-50/50 border-indigo-300'
                    : 'bg-slate-50/60 border-slate-200/80 hover:border-indigo-200'
                }`}
              >
                <div className="mt-0.5 text-indigo-600">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <span className={`text-xs font-medium ${isChecked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Personal Notes & Symptoms Scratchpad */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <Edit3 className="w-4 h-4 text-teal-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Personal Notes & Symptom Timeline
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Jot down any physical symptoms (e.g. fatigue, headaches, dietary changes) or specific concerns to mention to your doctor.
        </p>
        <textarea
          rows={3}
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          placeholder="e.g. Noticed occasional morning fatigue over the past 3 weeks; started iron-rich diet on Nov 1st..."
          className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
      </div>
    </div>
  );
}
