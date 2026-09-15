import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Award, X, ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { api } from "../../lib/api";

export function RankingsDrawerModal({ isOpen, onClose }) {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.evaluation.getRankings()
        .then((res) => setRankings(Array.isArray(res) ? res : []))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Trophy className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">CCEA Campus Leaderboard</h3>
              <p className="text-xs text-amber-100">Official Club Contribution & Excellence Standings</p>
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
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            rankings.map((r) => (
              <div
                key={r.rank}
                className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-amber-200 shadow-xs flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      r.rank === 1
                        ? "bg-amber-400 text-amber-950 shadow-md shadow-amber-400/30"
                        : r.rank === 2
                        ? "bg-slate-200 text-slate-800"
                        : r.rank === 3
                        ? "bg-orange-200 text-orange-900"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : r.rank}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{r.club}</p>
                    <p className="text-xs text-slate-400">{r.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-base font-bold text-slate-900 leading-none">{r.score}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">pts</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      r.trend.startsWith("+")
                        ? "bg-emerald-50 text-emerald-700"
                        : r.trend === "New"
                        ? "bg-sky-50 text-sky-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {r.trend}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with link to reveal ceremony */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">Updated weekly across 10 evaluation criteria.</p>
          <Link
            to="/ccea-reveal"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
          >
            <span>View Ceremony Reveal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
