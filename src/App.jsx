import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SafetyBanner from './components/SafetyBanner';
import DashboardView from './components/DashboardView';
import UploadView from './components/UploadView';
import ReportDetailsView from './components/ReportDetailsView';
import ComparisonView from './components/ComparisonView';
import DoctorPrepView from './components/DoctorPrepView';
import TimelineView from './components/TimelineView';
import ApiKeyModal from './components/ApiKeyModal';
import { storageService } from './services/storageService';
import { geminiService } from './services/geminiService';
import { DEMO_REPORTS } from './data/demoReports';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reports, setReports] = useState(() => storageService.getReports());
  const [activeReportId, setActiveReportId] = useState(() => {
    const reps = storageService.getReports();
    return reps[0]?.id || null;
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Find currently active report
  const activeReport = reports.find(r => r.id === activeReportId) || reports[0] || null;

  // Handle report analysis (multimodal image + text)
  const handleAnalyze = async ({
    imageBase64,
    imageMimeType,
    detectedFileType,
    reportText,
    reportTitle,
    reportDate
  }) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const analyzedReport = await geminiService.analyzeReport({
        imageBase64,
        imageMimeType,
        detectedFileType,
        reportText,
        reportTitle,
        reportDate
      });

      const updated = storageService.addReport(analyzedReport);
      setReports(updated);
      setActiveReportId(analyzedReport.id);
      setActiveTab('report');
      showToast(`Report "${analyzedReport.title}" analyzed successfully!`);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An unexpected error occurred while analyzing the report.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // One-click Demo runner
  const handleRunDemo = () => {
    setError(null);
    // Ensure both fictional demo reports are available in storage
    const updated = storageService.resetToDemo();
    setReports(updated);
    // Set to Demo Report 1 first as baseline
    setActiveReportId('demo-report-1');
    setActiveTab('report');
    showToast('Loaded fictional Demo Report 1 (Baseline). You can compare with Report 2 next!', 'success');
  };

  // Reset to demo data
  const handleResetData = () => {
    if (window.confirm('Reset all records back to the default fictional demo dataset?')) {
      const reset = storageService.resetToDemo();
      setReports(reset);
      setActiveReportId(reset[0]?.id || null);
      showToast('Data reset to fictional demo reports.');
    }
  };

  // Delete a report
  const handleDeleteReport = (id) => {
    if (window.confirm('Are you sure you want to delete this report from local storage?')) {
      const updated = storageService.deleteReport(id);
      setReports(updated);
      setActiveReportId(updated[0]?.id || null);
      showToast('Report deleted.');
      if (updated.length === 0) {
        setActiveTab('dashboard');
      }
    }
  };

  const handleSelectReport = (id) => {
    setActiveReportId(id);
    setActiveTab('report');
  };

  const handleNavigateToCompare = (reportId) => {
    if (reportId) setActiveReportId(reportId);
    setActiveTab('compare');
  };

  const handleNavigateToDoctorPrep = (reportId) => {
    if (reportId) setActiveReportId(reportId);
    setActiveTab('doctor-prep');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Safety Disclaimer Strip */}
      <SafetyBanner />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
        onRunDemo={handleRunDemo}
        onResetData={handleResetData}
        hasReports={reports.length > 0}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold ${
              toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <DashboardView
              reports={reports}
              onSelectReport={handleSelectReport}
              onNavigate={setActiveTab}
              onRunDemo={handleRunDemo}
            />
            {reports.length > 0 && (
              <TimelineView
                reports={reports}
                onSelectReport={handleSelectReport}
              />
            )}
          </div>
        )}

        {activeTab === 'upload' && (
          <UploadView
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            error={error}
            onClearError={() => setError(null)}
          />
        )}

        {activeTab === 'report' && (
          <ReportDetailsView
            report={activeReport}
            allReports={reports}
            onSelectReport={setActiveReportId}
            onDeleteReport={handleDeleteReport}
            onNavigateToCompare={handleNavigateToCompare}
            onNavigateToDoctorPrep={handleNavigateToDoctorPrep}
          />
        )}

        {activeTab === 'compare' && (
          <ComparisonView
            reports={reports}
            initialReportIdA={reports[0]?.id}
            initialReportIdB={reports[reports.length - 1]?.id}
            onNavigateToDoctorPrep={handleNavigateToDoctorPrep}
          />
        )}

        {activeTab === 'doctor-prep' && (
          <DoctorPrepView
            reports={reports}
            activeReportId={activeReportId}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            reports={reports}
            onSelectReport={handleSelectReport}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">CareBridge AI</span>
            <span>•</span>
            <span>Educational Health Report Understanding & Doctor-Visit Assistant</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setApiKeyModalOpen(true)}
              className="text-slate-600 hover:text-teal-600 font-medium"
            >
              API Key Settings
            </button>
            <span>•</span>
            <button
              onClick={handleRunDemo}
              className="text-slate-600 hover:text-teal-600 font-medium"
            >
              Load Demo Data
            </button>
            <span>•</span>
            <span>Hackathon Prototype</span>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onSave={() => showToast('Gemini API settings updated.')}
      />
    </div>
  );
}
