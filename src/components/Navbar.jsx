import React, { useState } from 'react';
import {
  Activity,
  UploadCloud,
  FileSpreadsheet,
  GitCompare,
  ClipboardList,
  Sparkles,
  KeyRound,
  RotateCcw,
  Menu,
  X
} from 'lucide-react';
import { storageService } from '../services/storageService';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenApiKeyModal,
  onRunDemo,
  onResetData,
  hasReports
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hasCustomKey = Boolean(storageService.getCustomApiKey());

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'upload', label: 'Upload & Analyze', icon: UploadCloud },
    { id: 'report', label: 'Report Details', icon: FileSpreadsheet, disabled: !hasReports },
    { id: 'compare', label: 'Compare & Trends', icon: GitCompare, disabled: !hasReports },
    { id: 'doctor-prep', label: 'Doctor Visit Prep', icon: ClipboardList, disabled: !hasReports },
  ];

  const handleNavClick = (id, disabled) => {
    if (disabled) return;
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-teal-600/20 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors">
                    CareBridge <span className="text-teal-600 font-extrabold">AI</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
                    Decision Support
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-500 font-normal">
                  Understand your reports. Prepare for better conversations with your doctor.
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  onClick={() => handleNavClick(item.id, item.disabled)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 border border-teal-200/80 shadow-xs'
                      : item.disabled
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Try Demo Report Button */}
            <button
              onClick={onRunDemo}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-sm shadow-teal-600/20 hover:shadow transition-all"
              title="Instantly test complete workflow with realistic fictional reports"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Try Demo Report</span>
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKeyModal}
              title={hasCustomKey ? 'Custom API key active' : 'Configure Gemini API Key'}
              className={`p-2 rounded-xl border text-xs font-medium transition ${
                hasCustomKey
                  ? 'bg-teal-50 border-teal-200 text-teal-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <KeyRound className="w-4 h-4" />
            </button>

            {/* Reset to Demo Data */}
            <button
              onClick={onResetData}
              title="Reset to default demo data"
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 lg:hidden text-slate-600 hover:bg-slate-50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => handleNavClick(item.id, item.disabled)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-semibold'
                    : item.disabled
                    ? 'text-slate-300'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
