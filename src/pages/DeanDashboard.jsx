import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { api } from "../lib/api";
import {
  BarChart3, Users, Building2, TrendingUp, Activity, Award,
  ArrowUpRight, ArrowDownRight, Sparkles, Send, Download, Eye, Calendar
} from "lucide-react";
import { InstitutionalNoticeModal } from "../components/dean/InstitutionalNoticeModal";
import { ClubDrilldownModal } from "../components/dean/ClubDrilldownModal";

function MetricCard({ label, value, sub, trend, icon: Icon }) {
  const trendUp = trend && trend > 0;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <Icon className="w-5 h-5 text-sky-500" />
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trendUp ? "text-emerald-600" : "text-rose-500"}`}>
            {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-sm font-semibold text-slate-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export function DeanDashboard() {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [hallOfExcellence, setHallOfExcellence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [academicCycle, setAcademicCycle] = useState("Cycle 1 (2025-2026)");

  // Modals state
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [selectedClubRanking, setSelectedClubRanking] = useState(null);

  useEffect(() => {
    Promise.all([
      api.admin.getAnalytics(),
      api.evaluation.getRankings(),
      api.awards.getHallOfExcellence(),
    ])
      .then(([a, r, h]) => {
        setAnalytics(a);
        setRankings(Array.isArray(r) ? r : []);
        setHallOfExcellence(Array.isArray(h) ? h : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadBrief = () => {
    const briefContent = `CLUB CONNECT INSTITUTIONAL EXECUTIVE BRIEF\nCycle: ${academicCycle}\nGenerated: ${new Date().toLocaleString()}\n` +
      `Total Active Clubs: ${analytics?.total_active_clubs || 24}\n` +
      `Students Engaged: ${analytics?.total_students_engaged || 1480}\n` +
      `Total Verified Activities: ${analytics?.total_verified_activities || 38}\n` +
      `Average Attendance Rate: ${analytics?.average_attendance_rate || 89.4}%\n\n` +
      `LEADERBOARD RANKINGS:\n` +
      rankings.map(r => `#${r.rank} ${r.club} (${r.category}) - Score: ${r.score}`).join("\n");

    const blob = new Blob([briefContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CCEA_Executive_Brief_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Executive Brief Downloaded", "Institutional leadership report generated successfully.");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-700 via-sky-600 to-blue-700 p-8 text-white shadow-xl shadow-sky-600/20 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-200 mb-1">Dean / Institutional Admin</p>
          <h1 className="text-3xl font-bold mb-1">Institutional Analytics</h1>
          <p className="text-sky-100 text-sm">
            Macro campus engagement trends, CCEA strategic insights, and institutional health overview.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadBrief}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-sky-200" />
            <span>Download Brief</span>
          </button>
          <button
            onClick={() => setNoticeModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-sky-50 text-indigo-900 text-xs font-bold shadow-md shadow-slate-950/20 active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5 text-indigo-600" />
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {loading || !analytics ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 h-32 animate-pulse" />
          ))
        ) : (
          <>
            <MetricCard icon={Building2} label="Active Clubs" value={analytics.total_active_clubs} sub={`${analytics.recognized_clubs} recognized`} trend={4} />
            <MetricCard icon={Users} label="Students Engaged" value={analytics.total_students_engaged.toLocaleString()} trend={12} />
            <MetricCard icon={Activity} label="Verified Activities" value={analytics.total_verified_activities} trend={8} />
            <MetricCard icon={Award} label="Evidence Items" value={analytics.verified_evidence_count} trend={-2} />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity trend chart (simplified bar) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-500" /> Monthly Activity Trend
            </h2>
            {loading || !analytics ? (
              <div className="flex items-end gap-3 h-28">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex-1 bg-slate-100 rounded-t-lg animate-pulse" style={{ height: `${i * 20}%` }} />
                ))}
              </div>
            ) : (
              <div className="flex items-end gap-2 h-32">
                {analytics.monthly_activity_trend.map((m) => {
                  const max = Math.max(...analytics.monthly_activity_trend.map((x) => x.count));
                  const pct = (m.count / max) * 100;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-xs font-bold text-sky-700">{m.count}</span>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-sky-500 to-sky-400 transition-all duration-700"
                        style={{ height: `${pct}%`, minHeight: "8px" }}
                      />
                      <span className="text-[10px] text-slate-400">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category distribution */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-500" /> Club Categories
            </h2>
            <div className="space-y-3">
              {(loading || !analytics ? [] : analytics.category_distribution).map((cat) => (
                <div key={cat.category} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-32 shrink-0">{cat.category}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-sky-700 w-8 text-right">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* CCEA Rankings */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> CCEA Rankings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wide">
                    <th className="pb-3 pr-4 font-medium">#</th>
                    <th className="pb-3 pr-4 font-medium">Club</th>
                    <th className="pb-3 pr-4 font-medium">Score</th>
                    <th className="pb-3 font-medium">Trend</th>
                    <th className="pb-3 font-medium text-right">Scorecard</th>
                  </tr>
                </thead>
                <tbody>
                  {(loading ? [] : rankings).map((r) => (
                    <tr
                      key={r.rank}
                      onClick={() => setSelectedClubRanking(r)}
                      className="border-b border-slate-50 last:border-0 hover:bg-sky-50/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 pr-4">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                          r.rank === 1 ? "bg-amber-100 text-amber-700" :
                          r.rank === 2 ? "bg-slate-100 text-slate-600" :
                          r.rank === 3 ? "bg-orange-100 text-orange-600" :
                          "bg-transparent text-slate-400"
                        }`}>{r.rank}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">{r.club}</p>
                        <p className="text-[11px] text-slate-400">{r.category}</p>
                      </td>
                      <td className="py-3 pr-4 font-bold text-sky-700">{r.score}</td>
                      <td className={`py-3 text-xs font-semibold ${r.trend.startsWith("+") ? "text-emerald-600" : r.trend === "New" ? "text-sky-600" : "text-rose-500"}`}>
                        {r.trend}
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-xs text-slate-400 group-hover:text-sky-600 font-medium inline-flex items-center gap-1">
                          <span>Inspect</span>
                          <Eye className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Hall of Excellence + AI */}
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-amber-200">Hall of Excellence</p>
            </div>
            <div className="space-y-3">
              {(loading ? [] : hallOfExcellence).map((h, i) => (
                <div key={i} className="border-t border-white/10 pt-3 first:border-0 first:pt-0">
                  <p className="text-[11px] text-amber-300 font-bold">{h.year} · {h.award}</p>
                  <p className="font-semibold text-white text-sm mt-0.5">{h.club_name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">{h.citation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-sky-600 to-blue-700 rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-sky-200" />
              <p className="text-xs font-bold uppercase tracking-wider text-sky-100">Strategic AI Brief</p>
            </div>
            <p className="text-sm text-sky-50 leading-relaxed">
              Student engagement is up 12% month-on-month. The Technology category shows the strongest verified activity pipeline. Consider increasing visibility support for at-risk clubs before the CCEA cycle closes.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Institutional Snapshot</p>
            <div className="space-y-2.5">
              {[
                { label: "Average attendance rate", value: `${analytics?.average_attendance_rate || "—"}%` },
                { label: "Total beneficiaries reached", value: analytics?.total_beneficiaries_reached?.toLocaleString() || "—" },
                { label: "Pending registrations", value: analytics?.pending_clubs || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className="text-xs font-bold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <InstitutionalNoticeModal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
      />

      <ClubDrilldownModal
        isOpen={!!selectedClubRanking}
        clubRanking={selectedClubRanking}
        onClose={() => setSelectedClubRanking(null)}
      />
    </div>
  );
}
