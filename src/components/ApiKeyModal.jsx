import React, { useState } from 'react';
import { KeyRound, Check, X, ShieldCheck, ExternalLink } from 'lucide-react';
import { storageService } from '../services/storageService';

export default function ApiKeyModal({ isOpen, onClose, onSave }) {
  const [apiKey, setApiKey] = useState(storageService.getCustomApiKey());
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    storageService.saveCustomApiKey(apiKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onSave?.();
      onClose();
    }, 600);
  };

  const handleClear = () => {
    storageService.saveCustomApiKey('');
    setApiKey('');
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onSave?.();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Gemini API Key</h3>
                <p className="text-xs text-slate-500">Optional configuration for custom analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            By default, CareBridge AI works with server-side environment variables and built-in offline parsing. You can optionally supply your personal Google Gemini API key directly here (stored strictly in your browser session/localStorage).
          </p>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1"
              >
                Get API key from Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
              {storageService.getCustomApiKey() && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-rose-600 hover:text-rose-700 font-medium"
                >
                  Remove key
                </button>
              )}
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Keys are never tracked or saved to external databases. Used solely for report parsing queries.</span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved
                  </>
                ) : (
                  'Save Key'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
