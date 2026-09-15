import React, { useState } from "react";
import { CheckCircle2, XCircle, ShieldCheck, X, ArrowRight, Clock } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export function ReviewItemModal({ isOpen, onClose, item, onItemResolved }) {
  const { toast } = useToast();
  const [decisionNotes, setDecisionNotes] = useState("Authorized by Committee Head Rostova.");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const handleResolve = (action) => {
    setSubmitting(true);
    setTimeout(() => {
      if (action === "approve") {
        toast.success(
          "Item Approved",
          `${item.criterion} for ${item.club} has been signed off and recorded in institutional ledger.`
        );
      } else {
        toast.warning(
          "Revision Requested",
          `Notification sent to ${item.club} with revision instructions.`
        );
      }
      if (onItemResolved) {
        onItemResolved(item, action);
      }
      setSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <ShieldCheck className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Governance Review Action</h3>
              <p className="text-xs text-sky-100">{item.criterion}</p>
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
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Club</span>
              <span className="font-bold text-slate-800">{item.club}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Review Criterion</span>
              <span className="font-mono text-sky-700 font-semibold">{item.criterion}</span>
            </div>
            <div className="pt-2 border-t border-slate-200/60">
              <p className="text-xs font-semibold text-slate-500 mb-0.5">Pending Item Description:</p>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{item.item}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Committee Head Sign-off Notes
            </label>
            <textarea
              rows={3}
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-sky-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleResolve("reject")}
              disabled={submitting}
              className="flex items-center gap-1 px-4 py-2 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Request Revision</span>
            </button>
            <button
              onClick={() => handleResolve("approve")}
              disabled={submitting}
              className="flex items-center gap-1 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve & Sign Off</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
