import React from "react";
import { Award, X, Building2, Users, Calendar, CheckCircle2, TrendingUp, ShieldCheck } from "lucide-react";

export function ClubDrilldownModal({ isOpen, onClose, clubRanking }) {
  if (!isOpen || !clubRanking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 font-bold text-lg shadow-inner">
              {clubRanking.rank === 1 ? "🥇" : clubRanking.rank === 2 ? "🥈" : clubRanking.rank === 3 ? "🥉" : `#${clubRanking.rank}`}
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">{clubRanking.club}</h3>
              <p className="text-xs text-sky-200">{clubRanking.category} · CCEA Performance Scorecard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Key Score Block */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Standing Score</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-0.5">{clubRanking.score} <span className="text-sm font-medium text-slate-500">/ 100</span></p>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                String(clubRanking.trend || "").startsWith("+")
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-sky-100 text-sky-800"
              }`}>
                Trend: {clubRanking.trend || "—"}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">CCEA Cycle 1 Position</p>
            </div>
          </div>

          {/* Dimension Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Evaluated Performance Dimensions
            </h4>
            <div className="space-y-2.5">
              {[
                { label: "Activity Cadence & Execution Quality", score: 94, max: 100 },
                { label: "Verified Attendance & Engagement Quorum", score: 89, max: 100 },
                { label: "Evidence Rigor & Documentation Quality", score: 92, max: 100 },
                { label: "Cross-Club Collaboration & Synergy", score: 88, max: 100 },
                { label: "Community & Institutional Impact", score: 91, max: 100 },
              ].map((dim) => (
                <div key={dim.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{dim.label}</span>
                    <span className="font-bold text-sky-700">{dim.score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {Array.isArray(clubRanking.lackings) && clubRanking.lackings.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-xs text-rose-900">
              <p className="font-bold mb-1.5">This month’s lackings</p>
              <ul className="space-y-1">
                {clubRanking.lackings.slice(0, 4).map((item) => (
                  <li key={item.code || item.title}>• {item.title || item.detail}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5">
            <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">CCEA standing</p>
              <p className="mt-0.5 text-amber-800">
                Band: <strong>{(clubRanking.band || clubRanking.health || "unscored").replace("_", " ")}</strong>.
                Open CCEA Reveal to present winners when the cycle is ready.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Close Scorecard
          </button>
        </div>
      </div>
    </div>
  );
}
