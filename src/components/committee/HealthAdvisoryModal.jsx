import React, { useState } from "react";
import { HeartPulse, X, ShieldAlert, Sparkles, ArrowRight, UserPlus, Calendar, HelpCircle } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export function HealthAdvisoryModal({ isOpen, onClose, selectedClub, onAdvisoryDispatched }) {
  const { toast } = useToast();
  const [supportType, setSupportType] = useState("advisor_mentorship");
  const [message, setMessage] = useState(
    "The Committee has noted recent reporting delays. We are assigning proactive developmental mentorship to ensure your club satisfies CCEA benchmark criteria before cycle completion."
  );
  const [gracePeriodDays, setGracePeriodDays] = useState(14);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !selectedClub) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Simulate dispatching health advisory intervention
      setTimeout(() => {
        toast.success(
          "Health Advisory Dispatched",
          `Developmental support framework initiated for ${selectedClub.club}. Advisory notice transmitted to club leaders & staff advisor.`
        );
        if (onAdvisoryDispatched) {
          onAdvisoryDispatched(selectedClub.club, supportType);
        }
        setSubmitting(false);
        onClose();
      }, 500);
    } catch (err) {
      toast.error("Dispatch Failed", err.message || "Failed to dispatch advisory.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <HeartPulse className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Developmental Support Intervention</h3>
              <p className="text-xs text-amber-100">PRS §15: Development Before Punishment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <p className="font-bold">Target Club: {selectedClub.club}</p>
              <p className="mt-0.5 text-amber-800">
                Current Health Status: <strong className="capitalize">{selectedClub.status.replace("_", " ")}</strong> · Last active {selectedClub.days_since_last_activity} days ago.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Support Intervention *
            </label>
            <select
              value={supportType}
              onChange={(e) => setSupportType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-amber-500"
            >
              <option value="advisor_mentorship">Assign Senior Faculty Advisor & Peer Mentorship</option>
              <option value="reporting_extension">Grant 14-Day Activity Reporting Grace Period</option>
              <option value="governance_clinic">Schedule Committee Governance Consultation Clinic</option>
              <option value="emergency_grant">Allocate Emergency Event Seed Assistance</option>
            </select>
          </div>

          {supportType === "reporting_extension" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Grace Period Duration (Days)
              </label>
              <input
                type="number"
                min="7"
                max="30"
                value={gracePeriodDays}
                onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-amber-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Advisory Guidance & Action Plan Notes *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-amber-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-amber-600/25 transition-all"
            >
              {submitting ? (
                <span>Dispatching...</span>
              ) : (
                <>
                  <span>Dispatch Support Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
