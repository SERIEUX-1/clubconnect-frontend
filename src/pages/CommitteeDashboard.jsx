import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { CheckCircle2, XCircle, FileStack, Eye, BarChart3, Clock, Sparkles } from "lucide-react";

export function CommitteeDashboard() {
  const { user } = useAuth();
  const [evidence, setEvidence] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleReview = async (id, status) => {
    await api.evidence.review(id, status, "Reviewed by committee member.");
    setEvidence((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="mb-8 sky-gradient-hero rounded-3xl p-8 border border-sky-100 shadow-sm">
        <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-1">Committee Member · Assigned Reviewer</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Evidence Review Queue</h1>
        <p className="text-slate-500 text-sm">
          Review evidence submissions, validate AI scoring recommendations, and inspect assigned clubs.
        </p>
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
        <div className="lg:col-span-2">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileStack className="w-4 h-4 text-sky-500" /> Evidence Queue
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 h-28 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {evidence.map((ev) => (
                <div key={ev.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
                  ev.status === "under_review"
                    ? "border-amber-200"
                    : ev.status === "verified"
                    ? "border-emerald-100"
                    : "border-slate-100"
                }`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-slate-900">{ev.caption}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{ev.club_name} · {ev.activity_title}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                      ev.status === "verified"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : ev.status === "under_review"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-50 text-slate-600 border border-slate-200"
                    }`}>
                      {ev.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{ev.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                      {ev.evidence_type.replace("_", " ")} · {ev.file_name}
                    </span>
                    {ev.status === "under_review" && (
                      <div className="flex gap-2 ml-auto">
                        <button
                          onClick={() => handleReview(ev.id, "verified")}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verify
                        </button>
                        <button
                          onClick={() => handleReview(ev.id, "rejected")}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 rounded-full hover:bg-rose-100 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                    {ev.status === "verified" && ev.reviewer_name && (
                      <p className="text-[11px] text-slate-400 ml-auto">
                        Verified by {ev.reviewer_name}
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
    </div>
  );
}
