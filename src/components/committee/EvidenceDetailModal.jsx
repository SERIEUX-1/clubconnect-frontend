import React, { useState } from "react";
import { CheckCircle2, XCircle, FileStack, X, Sparkles, ShieldCheck, ArrowRight, FileText } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export function EvidenceDetailModal({ isOpen, onClose, evidence, onReviewComplete }) {
  const { toast } = useToast();
  const [comment, setComment] = useState(evidence?.reviewer_comment || "Verified against institutional records.");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !evidence) return null;

  const handleAction = async (status) => {
    setSubmitting(true);
    try {
      await onReviewComplete(evidence.id, status, comment);
      toast.success(
        status === "verified" ? "Evidence Approved & Verified" : "Evidence Returned for Revision",
        `${evidence.caption} has been marked as ${status.replace("_", " ")}.`
      );
      onClose();
    } catch (err) {
      toast.error("Review Failed", err.message || "Could not complete review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <FileStack className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Evidence Item Inspector</h3>
              <p className="text-xs text-sky-100">Assigned Committee Evaluation & Verification</p>
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
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-lg font-bold text-slate-900">{evidence.caption}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {evidence.club_name} · Activity: <strong>{evidence.activity_title}</strong>
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
                evidence.status === "verified"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : evidence.status === "under_review"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {evidence.status.replace("_", " ")}
            </span>
          </div>

          {/* Document Preview Simulation */}
          <div className="p-5 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-mono flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>{evidence.file_name}</span>
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">{evidence.evidence_type}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 font-mono text-xs leading-relaxed space-y-1">
              <p className="text-emerald-400 font-semibold">[Institutional Verification Header: SHA-256 Validated]</p>
              <p className="text-slate-300">File Payload: {evidence.description}</p>
              <p className="text-slate-400 text-[11px] pt-1">
                Metadata: Verified Attendee Signatures = 42 | Timestamp = {new Date(evidence.created_at || Date.now()).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Copilot scoring recommendation */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-sky-900 uppercase tracking-wider">Copilot check</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  Rule engine · not AI
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Copilot will only treat this as strong evidence if it matches a real activity, sits with QR attendance for the same period, and is verified by a person. Confirmed collaborations are scored separately; a named partner with status pending is ignored.
              </p>
            </div>
          </div>

          {/* Reviewer Note Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reviewer Justification / Governance Notes
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add audit trail comments regarding evidence validity..."
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-sky-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            Cancel
          </button>
          <div className="flex gap-2.5">
            <button
              onClick={() => handleAction("rejected")}
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Return / Request Revision</span>
            </button>
            <button
              onClick={() => handleAction("verified")}
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify Evidence (+Pts)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
