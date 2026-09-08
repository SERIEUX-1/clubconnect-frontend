import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import {
  Trophy, BarChart3, Sliders, Eye, EyeOff, ChevronUp, ChevronDown,
  Sparkles, ShieldCheck, Award
} from "lucide-react";

const healthColors = {
  healthy: "bg-emerald-100 text-emerald-700",
  needs_attention: "bg-amber-100 text-amber-700",
  at_risk: "bg-rose-100 text-rose-700",
};

export function CCEARevealMode() {
  const { user } = useAuth();
  const [awards, setAwards] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [revealed, setRevealed] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.awards.getAwards(), api.evaluation.getRankings(), api.evaluation.getCriteria()])
      .then(([aw, rk, cr]) => {
        setAwards(Array.isArray(aw) ? aw : []);
        setRankings(Array.isArray(rk) ? rk : []);
        setCriteria(Array.isArray(cr) ? cr : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleReveal = (id) => {
    setRevealedState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [revealedState, setRevealedState] = useState({});

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Dramatic header */}
      <div className="mb-10 rounded-3xl overflow-hidden relative bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-10 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-amber-900" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-400">CCEA Ceremony Mode</p>
              <h1 className="text-2xl font-bold">Club Contribution & Excellence Awards</h1>
            </div>
          </div>
          <p className="text-slate-300 text-sm max-w-xl">
            Confidential award outcomes with reveal controls. Click "Reveal Winner" to unveil each award during the ceremony. Rankings and criteria weights are visible to committee heads only.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-slate-400">Logged in as:</span>
            <span className="text-xs font-semibold text-white bg-white/10 px-3 py-1 rounded-full">{user?.full_name} · Committee Head</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Awards reveal column */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" /> Award Outcomes
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-2xl border border-slate-100 h-36 animate-pulse" />)}
            </div>
          ) : (
            awards.map((award) => {
              const isRevealed = revealedState[award.id] ?? award.is_revealed;
              return (
                <div
                  key={award.id}
                  className={`rounded-2xl border shadow-sm overflow-hidden transition-all ${
                    isRevealed ? "border-amber-200 shadow-amber-100" : "border-slate-100"
                  }`}
                >
                  <div className={`p-5 ${isRevealed ? "bg-gradient-to-r from-amber-50 to-yellow-50" : "bg-white"}`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="font-bold text-slate-900">{award.category}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{award.description}</p>
                      </div>
                      <button
                        onClick={() => setRevealedState((p) => ({ ...p, [award.id]: !isRevealed }))}
                        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          isRevealed
                            ? "bg-amber-400 text-amber-900 hover:bg-amber-500"
                            : "bg-slate-900 text-white hover:bg-slate-700"
                        }`}
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {isRevealed ? "Hide" : "Reveal Winner"}
                      </button>
                    </div>

                    {/* Finalists */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {award.finalists.map((f) => (
                        <span key={f} className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                          isRevealed && f === award.winner
                            ? "bg-amber-400 text-amber-900"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {isRevealed && f === award.winner && "🏆 "}
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* Revealed winner */}
                    {isRevealed && (
                      <div className="mt-3 p-4 rounded-xl bg-amber-100/80 border border-amber-200">
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">🎉 Winner</p>
                        <p className="font-bold text-amber-900">{award.winner}</p>
                        <p className="text-xs text-amber-700 mt-1 leading-relaxed">{award.citation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Rankings + criteria weights */}
        <div className="space-y-5">
          {/* Confidential rankings */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-500" /> Confidential Rankings
            </h3>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-10 bg-slate-50 rounded animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {rankings.map((r) => (
                  <div key={r.rank} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      r.rank === 1 ? "bg-amber-100 text-amber-700" :
                      r.rank === 2 ? "bg-slate-100 text-slate-700" :
                      r.rank === 3 ? "bg-orange-100 text-orange-700" :
                      "bg-slate-50 text-slate-500"
                    }`}>
                      {r.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{r.club}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-bold text-sky-700">{r.score}</span>
                        <span className={`text-[10px] font-medium ${r.trend.startsWith("+") ? "text-emerald-600" : r.trend === "New" ? "text-sky-600" : "text-rose-500"}`}>
                          {r.trend}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${healthColors[r.health]}`}>
                      {r.health.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Criteria weights */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-500" /> Criteria Weights
            </h3>
            <div className="space-y-2.5">
              {(loading ? [] : criteria).map((c) => (
                <div key={c.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-slate-600">{c.label}</span>
                    <span className="text-[11px] font-bold text-violet-700">{c.weight}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                      style={{ width: `${(c.weight / 15) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
