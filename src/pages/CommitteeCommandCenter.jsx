import React, { useState } from "react";
import { StatCard } from "../components/ui/StatCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { MOCK_HEALTH_SUMMARY, MOCK_PENDING_REVIEWS } from "../data/mockClubs";
import { useToast } from "../context/ToastContext";
import { HealthAdvisoryModal } from "../components/committee/HealthAdvisoryModal";
import { ReviewItemModal } from "../components/committee/ReviewItemModal";
import {
  ShieldCheck, Sparkles, Download, HeartPulse, CheckCircle2,
  AlertTriangle, Filter, ArrowRight, CheckCheck, Clock
} from "lucide-react";

/**
 * PRS §15: "All clubs, pending work, health alerts and evaluation status"
 * at a glance. Built as the Committee Head's daily-driver screen, not a
 * generic admin table — health status reads as "here's how to help," per
 * the "development before punishment" principle: no red warning triangles,
 * just a clear status chip and the specific indicator behind it.
 */
export function CommitteeCommandCenter() {
  const { toast } = useToast();
  const [healthList, setHealthList] = useState(MOCK_HEALTH_SUMMARY);
  const [pendingReviews, setPendingReviews] = useState(MOCK_PENDING_REVIEWS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);

  // Modals state
  const [advisoryModalOpen, setAdvisoryModalOpen] = useState(false);
  const [targetClub, setTargetClub] = useState(null);
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);

  const atRiskCount = healthList.filter((c) => c.status === "at_risk").length;
  const needsAttentionCount = healthList.filter((c) => c.status === "needs_attention").length;

  const filteredHealth = healthList.filter((c) => {
    if (statusFilter === "all") return true;
    return c.status === statusFilter;
  });

  const handleRunDiagnostic = () => {
    setDiagnosticRunning(true);
    setTimeout(() => {
      setDiagnosticRunning(false);
      toast.success(
        "AI Health Diagnostic Completed",
        "Scanned all 24 recognized clubs. 2 clubs flagged for reporting delays. No systemic compliance breaches found."
      );
    }, 1000);
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

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      {/* Header with Quick Actions */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
            Clubs &amp; Societies Committee · Governance Head
          </p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">Committee Command Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time club health surveillance, developmental support interventions, and executive queue management.
          </p>
        </div>

        <div className="flex gap-2.5 shrink-0">
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
            <span>{diagnosticRunning ? "Running Diagnostics..." : "Run AI Health Scan"}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Recognized clubs</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">24</p>
        </div>
        <div className="rounded-2xl bg-white p-5 border border-amber-100 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Pending review items</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{pendingReviews.length}</p>
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
                  <th className="px-5 py-3 font-medium">Report completion</th>
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
                      {Math.round(row.report_completion_rate * 100)}%
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
              {pendingReviews.length} Active
            </span>
          </div>

          {pendingReviews.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white border border-slate-100 text-slate-400 text-sm">
              All governance items reviewed and signed off!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReviews.map((item, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedReviewItem(item)}
                  className="rounded-2xl bg-white p-4.5 border border-slate-100 hover:border-sky-300 shadow-sm cursor-pointer group transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-700">
                      {item.criterion}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-sky-600 flex items-center gap-0.5">
                      Review <ArrowRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{item.club}</p>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">{item.item}</p>
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
    </div>
  );
}
