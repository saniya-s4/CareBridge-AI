import React from 'react';
import { ShieldAlert, AlertCircle } from 'lucide-react';

export default function SafetyBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 text-xs sm:text-sm text-amber-900 flex items-center justify-between shadow-xs">
      <div className="max-w-7xl mx-auto w-full flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="leading-snug">
          <strong className="font-semibold text-amber-950">Educational Decision-Support Prototype:</strong>{' '}
          CareBridge AI provides educational information and is not a diagnostic or treatment tool. Medical decisions should be made with a qualified healthcare professional.
        </p>
      </div>
    </div>
  );
}
