import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "../components/ui/StatCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { MOCK_HEALTH_SUMMARY, MOCK_PENDING_REVIEWS } from "../data/mockClubs";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { HealthAdvisoryModal } from "../components/committee/HealthAdvisoryModal";
import { ReviewItemModal } from "../components/committee/ReviewItemModal";
import {
  ShieldCheck, Sparkles, Download, HeartPulse, CheckCircle2,
  AlertTriangle, Filter, ArrowRight, CheckCheck, Clock, Repeat, Users
} from "lucide-react";
import { HandoverModal } from "../components/leader/HandoverModal";

/**
 * PRS §15: "All clubs, pending work, health alerts and evaluation status"
 * at a glance. Built as the Committee Head's daily-driver screen, not a
 * generic admin table — health status reads as "here's how to help," per
 * the "development before punishment" principle: no red warning triangles,
 * just a clear status chip and the specific indicator behind it.
 */
export function CommitteeCommandCenter() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [healthList, setHealthList] = useState(MOCK_HEALTH_SUMMARY);
  const [pendingReviews, setPendingReviews] = useState(MOCK_PENDING_REVIEWS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);

  // Modals state
  const [advisoryModalOpen, setAdvisoryModalOpen] = useState(false);
  const [targetClub, setTargetClub] = useState(null);
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [briefing, setBriefing] = useState(null);
  const [pendingCharters, setPendingCharters] = useState([]);
  const [charterBusy, setCharterBusy] = useState(null);
  const [campusHandoverOpen, setCampusHandoverOpen] = useState(false);

  const loadPendingCharters = () => {
    api.clubs
      .listManaged("?status=pending")
      .then((rows) => setPendingCharters(Array.isArray(rows) ? rows : []))
      .catch(() => setPendingCharters([]));
  };

  useEffect(() => {
    api.copilot
      .healthScan()
      .then((scan) => {
        setMonthly(scan);
        if (Array.isArray(scan.health_roster) && scan.health_roster.length) {
          setHealthList(scan.health_roster);
        }
      })
      .catch(() => {
        api.evaluation.monthly().then(setMonthly).catch(() => setMonthly(null));
      });
    api.copilot.committeeBriefing(user?.catch_up_since).then(setBriefing).catch(() => setBriefing(null));
    loadPendingCharters();
  }, [user?.catch_up_since]);

  useEffect(() => {
    const onCopilot = (event) => {
      if (event.detail?.action === "open_pending_clubs") {
        document.getElementById("pending-charters")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("cc-copilot-action", onCopilot);
    return () => window.removeEventListener("cc-copilot-action", onCopilot);
  }, []);

  const waitingQueue = briefing?.waiting_on_you?.length ? briefing.waiting_on_you : pendingReviews;
  const waitingCount = briefing?.counts?.waiting_on_you ?? waitingQueue.length;
  const atRiskCount = healthList.filter((c) => c.status === "at_risk").length;
  const needsAttentionCount = healthList.filter((c) => c.status === "needs_attention").length;

  const filteredHealth = healthList.filter((c) => {
    if (statusFilter === "all") return true;
    return c.status === statusFilter;
  });

  const handleRunDiagnostic = async () => {
    setDiagnosticRunning(true);
    try {
      const scan = await api.copilot.healthScan();
      setMonthly(scan);
      if (Array.isArray(scan.health_roster) && scan.health_roster.length) {
        setHealthList(scan.health_roster);
      }
      const brief = await api.copilot.committeeBriefing(user?.catch_up_since).catch(() => null);
      if (brief) setBriefing(brief);
      toast.success(
        "Copilot Health Scan complete",
        scan.brief ||
          `${scan.at_risk?.length || 0} clubs at risk · ${scan.needs_attention?.length || 0} need attention. Confirmed collaborations counted.`
      );
    } catch (err) {
      toast.error("Copilot Health Scan failed", err.message || "Sign in as committee head or staff to run a campus scan.");
    } finally {
      setDiagnosticRunning(false);
    }
  };

  const handleExportRoster = () => {
    const csvRows = [
      ["Club Name", "Health Status", "Days Since Last Activity", "Report Completion Rate"],
      ...healthList.map((r) => [
        `"${r.club}"`,
        r.status,
        r.days_since_last_activity,
        `${Math.round(r.report_completion_rate * 100)}%`,
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CCEA_Institutional_Health_Roster_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Roster Exported", "Institutional club health summary downloaded as CSV.");
  };

  const handleOpenAdvisory = (clubRow) => {
    setTargetClub(clubRow);
    setAdvisoryModalOpen(true);
  };

  const handleAdvisoryDispatched = (clubName, supportType) => {
    setHealthList((prev) =>
      prev.map((c) =>
        c.club === clubName
          ? { ...c, status: "needs_attention", advisory_active: true }
          : c
      )
    );
  };

  const handleItemResolved = (item, action) => {
    setPendingReviews((prev) => prev.filter((i) => i.item !== item.item));
  };

  const handleCharter = async (club, action) => {
    setCharterBusy(club.id);
    try {
      if (action === "recognize") await api.clubs.recognize(club.id);
      else await api.clubs.rejectCharter(club.id);
      setPendingCharters((prev) => prev.filter((row) => row.id !== club.id));
      toast.success(
        action === "recognize" ? "Club recognised" : "Charter declined",
        action === "recognize"
          ? `${club.name} is now in the public directory.`
          : `${club.name} was archived as dormant.`
      );
      const brief = await api.copilot.committeeBriefing(user?.catch_up_since).catch(() => null);
      if (brief) setBriefing(brief);
    } catch (err) {
      toast.error("Charter action failed", err.message || "Could not update this club.");
    } finally {
      setCharterBusy(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      {/* Header with Quick Actions */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
            {user?.role === "staff" || user?.role === "system_admin"
              ? "Staff / Lecturers · Campus Command Center"
              : "Clubs & Societies Committee · Governance Head"}
          </p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">Welcome back</h1>
          <p className="text-xs text-slate-500 mt-1">
            {user?.role === "staff" || user?.role === "system_admin"
              ? "Campus health, pending charters, and Copilot scan — the same oversight workspace staff inherit from the former dean tools."
              : "Catch-up summary of everything that happened while you were away — most urgent first, then what already got done."}
          </p>
        </div>

        <div className="flex gap-2.5 shrink-0">
            {user?.role === "committee_head" && (
              <button
                type="button"
                onClick={() => setCampusHandoverOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
              >
                <Repeat className="w-3.5 h-3.5 text-slate-500" />
                <span>Handover</span>
              </button>
            )}
            {user?.role === "committee_head" && (
              <button
                type="button"
                onClick={() => navigate("/membership-ledger")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Membership & grant</span>
              </button>
            )}
            <button
            onClick={() => navigate(user?.role === "staff" || user?.role === "system_admin" ? "/staff-dashboard" : "/committee-dashboard")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{user?.role === "staff" || user?.role === "system_admin" ? "Analytics" : "Evidence queue"}</span>
          </button>
          <button
            onClick={handleExportRoster}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Roster</span>
          </button>
          <button
            onClick={handleRunDiagnostic}
            disabled={diagnosticRunning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 active:scale-95 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{diagnosticRunning ? "Scanning with Copilot…" : "Run Copilot Health Scan"}</span>
          </button>
        </div>
      </div>

      {briefing && (
        <div className="mb-10 rounded-3xl border border-sky-200 bg-gradient-to-br from-white via-sky-50 to-white p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-600">
            Copilot · Clubs &amp; Societies Committee Head
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {briefing.away_label || "Campus catch-up"}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{briefing.headline}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800 ring-1 ring-amber-100">
              {briefing.counts?.waiting_on_you || 0} waiting on you
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800 ring-1 ring-emerald-100">
              {briefing.counts?.what_got_done || 0} already moved
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              {briefing.days_away || 0} day(s) away
            </span>
          </div>
          {briefing.items?.length ? (
            <ol className="mt-6 space-y-2">
              {briefing.items.map((item, index) => (
                <li key={`${item.category}-${item.title}-${index}`}>
                  <button
                    type="button"
                    onClick={() => item.path && navigate(item.path)}
                    className="flex w-full gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-3 text-left shadow-xs transition hover:border-sky-200 hover:shadow-sm"
                  >
                    <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${item.waiting_on_you ? "bg-amber-600" : item.urgency_label === "While you were away" ? "bg-emerald-600" : "bg-sky-600"}`}>
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-sky-700">
                        {item.urgency_label}
                        {item.waiting_on_you ? " · waiting on you" : ""}
                        {item.category ? ` · ${item.category}` : ""}
                      </p>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{item.detail}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-6 rounded-2xl bg-white px-4 py-6 text-sm text-slate-500">
              You are fully caught up. No approvals waiting, and nothing urgent piled up while you were away.
            </p>
          )}
        </div>
      )}

      {pendingCharters.length > 0 && (
        <div id="pending-charters" className="mb-10 rounded-2xl border border-amber-200 bg-amber-50/60 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Waiting on you · charters</p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">Clubs waiting for recognition</h2>
          <p className="mt-1 text-xs text-slate-500">
            Students requested these clubs. Recognise to publish them; decline to archive the request.
          </p>
          <div className="mt-4 space-y-3">
            {pendingCharters.map((club) => (
              <div key={club.id} className="rounded-2xl border border-amber-100 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{club.name}</p>
                    <p className="text-[11px] text-slate-500">{club.category}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {club.charter_statement || club.mission || club.description || "No charter statement provided."}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={charterBusy === club.id}
                      onClick={() => handleCharter(club, "reject")}
                      className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-700 disabled:opacity-50"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      disabled={charterBusy === club.id}
                      onClick={() => handleCharter(club, "recognize")}
                      className="rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-50"
                    >
                      Recognise
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Recognized clubs</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{monthly?.club_count || healthList.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 border border-amber-100 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Pending review items</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{waitingCount}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Needs attention</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{needsAttentionCount}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 border border-rose-100 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-rose-600">At risk</p>
          <p className="mt-2 text-3xl font-bold text-rose-600">{atRiskCount}</p>
        </div>
      </div>

      {monthly?.clubs && (
        <div className="mb-10 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-600">Copilot Health Scan</p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            {monthly.institution} · {monthly.period_year}-{String(monthly.period_month).padStart(2, "0")}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Built by ClubConnect Copilot from reports, QR attendance, confirmed collaborations, and evidence.
          </p>
          <div className="mt-4 space-y-2">
            {monthly.clubs.slice(0, 8).map((row) => (
              <div key={row.club_id} className="rounded-xl border border-slate-100 px-3 py-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">{row.club_name}</span>
                  <span className="font-mono text-xs text-slate-500">
                    {row.score} · {row.band.replace("_", " ")}
                  </span>
                </div>
                {row.lackings?.length > 0 && (
                  <p className="mt-1 text-[11px] text-slate-500">
                    {row.lackings.map((l) => l.title).join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Club Health roster */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-sky-600" />
              <span>Institutional Club Health</span>
            </h2>

            {/* Health filter */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              {[
                { id: "all", label: `All (${healthList.length})` },
                { id: "healthy", label: "Healthy" },
                { id: "needs_attention", label: `Attention (${needsAttentionCount})` },
                { id: "at_risk", label: `At Risk (${atRiskCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    statusFilter === tab.id
                      ? "bg-white text-slate-900 font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 bg-slate-50/50">
                  <th className="px-5 py-3 font-medium">Club</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Last activity</th>
                  <th className="px-5 py-3 font-medium">Report</th>
                  <th className="px-5 py-3 font-medium">Confirmed collabs</th>
                  <th className="px-5 py-3 font-medium text-right">Intervention</th>
                </tr>
              </thead>
              <tbody>
                {filteredHealth.map((row) => (
                  <tr key={row.club} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{row.club}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-500 text-xs">
                      {row.days_since_last_activity}d ago
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700 text-xs font-semibold">
                      {Math.round((row.report_completion_rate || 0) * 100)}%
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700 text-xs font-semibold">
                      {row.confirmed_collaborations ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {row.status === "at_risk" || row.status === "needs_attention" ? (
                        <button
                          onClick={() => handleOpenAdvisory(row)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors shadow-xs"
                        >
                          <HeartPulse className="w-3 h-3" />
                          <span>Help Club</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-semibold">In Good Standing</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending review queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Needs Your Review</span>
            </h2>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {waitingCount} Active
            </span>
          </div>

          {waitingQueue.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white border border-slate-100 text-slate-400 text-sm">
              All governance items reviewed and signed off!
            </div>
          ) : (
            <div className="space-y-3">
              {waitingQueue.map((item, i) => (
                <div
                  key={item.title || item.item || i}
                  onClick={() => (item.path ? navigate(item.path) : setSelectedReviewItem(item))}
                  className="rounded-2xl bg-white p-4.5 border border-slate-100 hover:border-sky-300 shadow-sm cursor-pointer group transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-700">
                      {item.category || item.criterion || "Waiting on you"}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-sky-600 flex items-center gap-0.5">
                      Review <ArrowRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{item.title || item.club}</p>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">{item.detail || item.item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Modals */}
      <HealthAdvisoryModal
        isOpen={advisoryModalOpen}
        onClose={() => setAdvisoryModalOpen(false)}
        selectedClub={targetClub}
        onAdvisoryDispatched={handleAdvisoryDispatched}
      />

      <ReviewItemModal
        isOpen={!!selectedReviewItem}
        item={selectedReviewItem}
        onClose={() => setSelectedReviewItem(null)}
        onItemResolved={handleItemResolved}
      />
      <HandoverModal
        isOpen={campusHandoverOpen}
        onClose={() => setCampusHandoverOpen(false)}
        variant="campus"
      />
    </div>
  );
}
