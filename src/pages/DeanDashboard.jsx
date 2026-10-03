import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import {
  BarChart3, Users, Building2, TrendingUp, Activity, Award,
  ArrowUpRight, ArrowDownRight, Sparkles, Send, Download, Eye
} from "lucide-react";
import { InstitutionalNoticeModal } from "../components/dean/InstitutionalNoticeModal";

function MetricCard({ label, value, sub, trend, icon: Icon }) {
  const trendUp = trend && trend > 0;
  return (
    <div className="rounded-2xl border border-sky-100/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm">
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
  const { user } = useAuth();
  const campus = user?.institution?.short_name || "Campus";
  const [analytics, setAnalytics] = useState(null);
  const [hallOfExcellence, setHallOfExcellence] = useState([]);
  const [loading, setLoading] = useState(true);

  const [noticeModalOpen, setNoticeModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      api.admin.getAnalytics(),
      api.awards.getHallOfExcellence(),
    ])
      .then(([a, h]) => {
        setAnalytics(a);
        setHallOfExcellence(Array.isArray(h) ? h : []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onCopilot = (event) => {
      if (event.detail?.action === "open_broadcast_notice") {
        setNoticeModalOpen(true);
      }
    };
    window.addEventListener("cc-copilot-action", onCopilot);
    return () => window.removeEventListener("cc-copilot-action", onCopilot);
  }, []);

  const academicCycle = analytics?.period_year
    ? `${campus} · ${analytics.period_year}-${String(analytics.period_month).padStart(2, "0")}`
    : campus;

  const trend = Array.isArray(analytics?.monthly_activity_trend)
    ? analytics.monthly_activity_trend
    : [];
  const categories = Array.isArray(analytics?.category_distribution)
    ? analytics.category_distribution
    : [];

  const handleDownloadBrief = async () => {
    try {
      const brief = await api.admin.getCampusBrief();
      const blob = new Blob([brief.text || ""], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ClubConnect_Brief_${brief.academic_year || Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Executive brief downloaded", "Built from live campus records. Unpublished awards are not in this file.");
    } catch (err) {
      toast.error(err.message || "Could not download the campus brief.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="cc-dusk mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6 rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-200 mb-1">Staff / Lecturers · {campus}</p>
          <h1 className="text-3xl font-bold mb-1">Institutional Analytics</h1>
          <p className="text-sky-100 text-sm">
            Live campus engagement and notices. Campus Clubs Excellence Awards marks stay with the Committee Head until they publish the ceremony.
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-sky-50 text-sky-950 text-xs font-bold shadow-md shadow-slate-950/20 active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5 text-sky-600" />
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {loading || !analytics ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white/80 rounded-2xl border border-sky-100 h-32 animate-pulse" />
          ))
        ) : (
          <>
            <MetricCard icon={Building2} label="Active Clubs" value={analytics.total_active_clubs ?? 0} sub={`${analytics.recognized_clubs ?? 0} recognized`} />
            <MetricCard icon={Users} label="Students Engaged" value={(analytics.total_students_engaged ?? 0).toLocaleString()} />
            <MetricCard icon={Activity} label="Verified Activities" value={analytics.total_verified_activities ?? 0} />
            <MetricCard icon={Award} label="Evidence Items" value={analytics.verified_evidence_count ?? 0} />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/90 rounded-2xl border border-sky-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-500" /> Monthly Activity Trend
            </h2>
            {loading || !analytics ? (
              <div className="flex items-end gap-3 h-28">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex-1 bg-slate-100 rounded-t-lg animate-pulse" style={{ height: `${i * 20}%` }} />
                ))}
              </div>
            ) : trend.length === 0 ? (
              <p className="text-sm text-slate-500">No scheduled events yet this year — the chart fills as clubs publish dates.</p>
            ) : (
              <div className="flex items-end gap-2 h-32">
                {trend.map((m) => {
                  const max = Math.max(1, ...trend.map((x) => x.count || 0));
                  const pct = ((m.count || 0) / max) * 100;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-xs font-bold text-sky-700">{m.count}</span>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-sky-500 to-amber-300 transition-all duration-700"
                        style={{ height: `${pct}%`, minHeight: "8px" }}
                      />
                      <span className="text-[10px] text-slate-400">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white/90 rounded-2xl border border-sky-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-500" /> Club Categories
            </h2>
            <div className="space-y-3">
              {categories.length === 0 && !loading ? (
                <p className="text-sm text-slate-500">No recognised clubs to chart yet.</p>
              ) : (
                categories.map((cat) => (
                  <div key={cat.category} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-32 shrink-0">{cat.category}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-amber-400 transition-all duration-500"
                        style={{ width: `${cat.percentage || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-sky-700 w-8 text-right">{cat.percentage}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl border border-amber-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Campus Clubs Excellence Awards
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Marks, rankings, and the scoring process stay with the Clubs and Societies Committee Head until they publish the ceremony. Staff and lecturers watch the same published club films and the Hall of Excellence as everyone else.
            </p>
            <Link to="/hall-of-excellence" className="mt-4 inline-flex text-xs font-bold text-amber-700 hover:text-amber-800">
              Open the Hall of Excellence →
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-amber-200">Hall of Excellence</p>
            </div>
            <div className="space-y-3">
              {(loading ? [] : hallOfExcellence).map((h, i) => (
                <div key={h.id || i} className="border-t border-white/10 pt-3 first:border-0 first:pt-0">
                  <p className="text-[11px] text-amber-300 font-bold">{h.year} · {h.award}</p>
                  <p className="font-semibold text-white text-sm mt-0.5">{h.club_name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">{h.citation}</p>
                </div>
              ))}
              {!loading && hallOfExcellence.length === 0 && (
                <p className="text-sm text-slate-400">No Hall of Excellence entries for this campus yet.</p>
              )}
            </div>
            <Link to="/hall-of-excellence" className="mt-4 inline-flex text-xs font-bold text-amber-300 hover:text-amber-200">
              Open the full Hall of Excellence →
            </Link>
          </div>

          <div className="cc-dusk rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-sky-200" />
              <p className="text-xs font-bold uppercase tracking-wider text-sky-100">Watch published work</p>
            </div>
            <p className="text-sm text-sky-50 leading-relaxed">
              Open any recognised club to watch the same published films, photos, and projects that students and leaders see. Unpublished CCEA marks stay with the Committee Head.
            </p>
            <Link to="/" className="mt-3 inline-flex text-xs font-bold text-sky-200 hover:text-white">
              Discover clubs →
            </Link>
          </div>

          <div className="bg-white/90 rounded-2xl border border-sky-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Institutional Snapshot</p>
            <div className="space-y-2.5">
              {[
                { label: "Average attendance rate", value: analytics?.average_attendance_rate != null ? `${analytics.average_attendance_rate}%` : "—" },
                { label: "Total beneficiaries reached", value: analytics?.total_beneficiaries_reached?.toLocaleString?.() || analytics?.total_beneficiaries_reached || "—" },
                { label: "Pending registrations", value: analytics?.pending_clubs ?? "—" },
                { label: "Verified evidence", value: analytics?.verified_evidence_count ?? "—" },
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

      <InstitutionalNoticeModal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
      />

    </div>
  );
}
