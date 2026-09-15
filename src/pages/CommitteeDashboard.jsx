import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../lib/api";
import { CheckCircle2, XCircle, FileStack, Eye, BarChart3, Clock, Sparkles, Download, CheckCheck, Filter } from "lucide-react";
import { EvidenceDetailModal } from "../components/committee/EvidenceDetailModal";

export function CommitteeDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [evidence, setEvidence] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  useEffect(() => {
    Promise.all([api.evidence.list(), api.evaluation.getCriteria()])
      .then(([ev, cr]) => {
        setEvidence(Array.isArray(ev) ? ev : []);
        setCriteria(Array.isArray(cr) ? cr : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const pending = evidence.filter((e) => e.status === "under_review");
  const verified = evidence.filter((e) => e.status === "verified");
  const rejected = evidence.filter((e) => e.status === "rejected");

  const filteredEvidence = evidence.filter((e) => {
    if (filter === "all") return true;
    return e.status === filter;
  });

  const handleReview = async (id, status, comment = "Reviewed by committee member.") => {
    await api.evidence.review(id, status, comment);
    setEvidence((prev) => prev.map((e) => (e.id === id ? { ...e, status, reviewer_comment: comment, reviewer_name: user?.full_name || "Marcus Vance" } : e)));
  };

  const handleBatchVerify = async () => {
    if (pending.length === 0) {
      toast.info("Queue Clear", "No evidence items currently awaiting review.");
      return;
    }

    const count = pending.length;
    for (const item of pending) {
      await api.evidence.review(item.id, "verified", "Batch verified via AI concordance verification.");
    }
    setEvidence((prev) =>
      prev.map((e) =>
        e.status === "under_review"
          ? { ...e, status: "verified", reviewer_name: user?.full_name || "Marcus Vance" }
          : e
      )
    );
    toast.success("Batch Verification Complete", `${count} pending evidence submissions verified and recorded.`);
  };

  const handleExportReviewQueue = () => {
    const csvRows = [
      ["Evidence ID", "Club", "Activity", "Caption", "Category", "Status", "Reviewer"],
      ...evidence.map((e) => [
        e.id,
        `"${e.club_name}"`,
        `"${e.activity_title}"`,
        `"${e.caption}"`,
        e.evidence_type,
        e.status,
        `"${e.reviewer_name || ""}"`,
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((r) => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CCEA_Evidence_Review_Log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export Complete", "Evidence review ledger downloaded as CSV.");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="mb-8 sky-gradient-hero rounded-3xl p-8 border border-sky-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-1">Committee Member · Assigned Reviewer</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Evidence Review Queue</h1>
          <p className="text-slate-500 text-sm max-w-xl">
            Review evidence submissions, inspect AI concordance benchmarks, and substantiate CCEA club portfolios.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleExportReviewQueue}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Log</span>
          </button>
          <button
            onClick={handleBatchVerify}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Batch Verify ({pending.length})</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
          <p className="text-2xl font-bold text-amber-600">{loading ? "—" : pending.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Awaiting review</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
          <p className="text-2xl font-bold text-emerald-600">{loading ? "—" : verified.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Verified this cycle</p>
        </div>
        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5">
          <p className="text-2xl font-bold text-sky-600">{loading ? "—" : evidence.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total in queue</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Evidence queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <FileStack className="w-4 h-4 text-sky-500" /> Submissions Queue
            </h2>

            {/* Filter Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              {[
                { id: "all", label: `All (${evidence.length})` },
                { id: "under_review", label: `Pending (${pending.length})` },
                { id: "verified", label: `Verified (${verified.length})` },
                { id: "rejected", label: `Rejected (${rejected.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filter === tab.id
                      ? "bg-white text-slate-900 font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 h-28 animate-pulse" />
              ))}
            </div>
          ) : filteredEvidence.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 text-slate-400 text-sm">
              No evidence items match this filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvidence.map((ev) => (
                <div
                  key={ev.id}
                  className={`bg-white rounded-2xl border shadow-sm p-5 transition-all hover:shadow-md cursor-pointer ${
                    ev.status === "under_review"
                      ? "border-amber-200"
                      : ev.status === "verified"
                      ? "border-emerald-100"
                      : "border-rose-100"
                  }`}
                  onClick={() => setSelectedEvidence(ev)}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm hover:text-sky-600 transition-colors flex items-center gap-1.5">
                        <span>{ev.caption}</span>
                        <Eye className="w-3.5 h-3.5 text-slate-400 inline" />
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{ev.club_name} · {ev.activity_title}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                      ev.status === "verified"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : ev.status === "under_review"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {ev.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{ev.description}</p>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                      {ev.evidence_type.replace("_", " ")} · {ev.file_name}
                    </span>
                    {ev.status === "under_review" && (
                      <div className="flex gap-2 ml-auto">
                        <button
                          onClick={() => {
                            handleReview(ev.id, "verified");
                            toast.success("Evidence Verified", `${ev.caption} marked verified.`);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-500 text-white rounded-full hover:bg-emerald-600 active:scale-95 transition-all shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verify
                        </button>
                        <button
                          onClick={() => {
                            handleReview(ev.id, "rejected");
                            toast.warning("Evidence Returned", `${ev.caption} returned for revision.`);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 rounded-full hover:bg-rose-100 active:scale-95 transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                    {ev.status === "verified" && ev.reviewer_name && (
                      <p className="text-[11px] text-slate-400 ml-auto flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Verified by {ev.reviewer_name}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: criteria weights */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-500" /> CCEA Evaluation Criteria
            </h3>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-8 bg-slate-50 rounded animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-2.5">
                {criteria.map((c) => (
                  <div key={c.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600">{c.label}</span>
                      <span className="text-xs font-bold text-sky-700">{c.weight}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-500"
                        style={{ width: `${(c.weight / 15) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-sky-600 to-blue-700 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-sky-200" />
              <p className="text-xs font-bold text-sky-100 uppercase tracking-wider">AI Scoring Assistant</p>
            </div>
            <p className="text-sm text-sky-50 leading-relaxed">
              The AI has flagged 2 evidence items for priority review based on participation anomalies. Cross-check against institutional attendance records before verifying.
            </p>
          </div>
        </div>
      </div>

      <EvidenceDetailModal
        isOpen={!!selectedEvidence}
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
        onReviewComplete={handleReview}
      />
    </div>
  );
}
