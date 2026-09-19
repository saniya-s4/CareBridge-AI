import React from 'react';
import { Calendar, FileText, ArrowDown, ChevronRight, Activity } from 'lucide-react';

export default function TimelineView({ reports, onSelectReport }) {
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
        <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="text-xs text-slate-500">No timeline data available yet.</p>
      </div>
    );
  }

  // Sort chronologically earliest to newest
  const sorted = [...reports].sort((a, b) => {
    const dateA = new Date(a.date || '1970-01-01').getTime();
    const dateB = new Date(b.date || '1970-01-01').getTime();
    return dateA - dateB;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Health Timeline
          </h3>
          <p className="text-xs text-slate-500">
            Chronological log of medical laboratory records
          </p>
        </div>
      </div>

      <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {sorted.map((report, idx) => {
          const isLatest = idx === sorted.length - 1;
          const displayDate = report.date
            ? new Date(report.date).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })
            : 'Date unavailable';

          const abnormalCount = (report.structuredTests || []).filter(
            t => t.status === 'High' || t.status === 'Low'
          ).length;

          return (
            <div key={report.id} className="relative group">
              {/* Timeline circle node */}
              <div
                className={`absolute -left-[27px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isLatest
                    ? 'bg-teal-600 border-teal-200 ring-4 ring-teal-50 text-white'
                    : 'bg-white border-teal-500 text-teal-600'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              </div>

              {/* Card */}
              <div
                onClick={() => onSelectReport?.(report.id)}
                className="bg-slate-50 hover:bg-teal-50/30 border border-slate-200 hover:border-teal-300 rounded-xl p-4 cursor-pointer transition-all flex items-center justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      {displayDate}
                    </span>
                    {isLatest && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded bg-teal-100 text-teal-800">
                        Latest Report
                      </span>
                    )}
                    {report.isDemo && (
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        Fictional
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    {report.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{report.structuredTests?.length || 0} biomarkers</span>
                    {abnormalCount > 0 ? (
                      <span className="text-amber-700 font-medium">
                        • {abnormalCount} flagged values
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium">
                        • All values within range
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition" />
              </div>

              {/* Arrow connector indicator */}
              {!isLatest && (
                <div className="pl-4 pt-2 text-slate-400">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
