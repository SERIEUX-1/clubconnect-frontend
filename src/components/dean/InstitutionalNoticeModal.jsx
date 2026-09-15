import React, { useState } from "react";
import { Send, X, Megaphone, ShieldCheck, ArrowRight } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export function InstitutionalNoticeModal({ isOpen, onClose }) {
  const { toast } = useToast();
  const [targetAudience, setTargetAudience] = useState("all_clubs");
  const [subject, setSubject] = useState("Official Notice: CCEA Evaluation Cycle 1 Deadline & Evidence Standards");
  const [priority, setPriority] = useState("normal");
  const [message, setMessage] = useState(
    "Dear Club Presidents and Staff Advisors,\n\nPlease ensure all September monthly narrative reports, attendance sign-in sheets, and cross-club collaboration confirmations are uploaded to ClubConnect no later than Friday at 17:00. Late submissions will affect CCEA category rankings."
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(
        "Executive Circular Dispatched",
        `Institutional advisory transmitted to ${targetAudience.replace("_", " ")} via official campus portal & email notification.`
      );
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 via-sky-700 to-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Megaphone className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Broadcast Institutional Notice</h3>
              <p className="text-xs text-sky-100">Dean of Student Affairs & Academic Directorate</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-sky-500"
              >
                <option value="all_clubs">All Recognized Clubs (24)</option>
                <option value="attention_clubs">Clubs Requiring Attention / At Risk (3)</option>
                <option value="staff_advisors">Faculty & Staff Advisors Only</option>
                <option value="committee_members">Clubs & Societies Committee Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Notice Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-sky-500"
              >
                <option value="normal">Standard Executive Circular</option>
                <option value="urgent">Urgent Institutional Directive</option>
                <option value="confidential">Confidential Governance Advisory</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Subject Line *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notice Content *
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-sky-500 leading-relaxed font-sans"
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
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
            >
              {submitting ? (
                <span>Broadcasting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Notice</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
