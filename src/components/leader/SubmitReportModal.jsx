import React, { useState } from "react";
import { FileText, X, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

export function SubmitReportModal({ isOpen, onClose, clubId, clubName, onSubmitSuccess }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    activity_type: "Workshop",
    date_time: new Date().toISOString().slice(0, 16),
    location: "Campus Main Building Room 102",
    expected_participation: 30,
    actual_participation: 35,
    objective: "",
    report_text: "",
    lessons_learned: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.objective.trim() || !formData.report_text.trim()) {
      toast.warning("Incomplete Report", "Please complete all mandatory report narrative fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        club_id: clubId || "1",
        club_name: clubName || "Robotics club",
        expected_participation: Number(formData.expected_participation),
        actual_participation: Number(formData.actual_participation),
        status: "submitted",
      };

      const result = await api.activities.create(payload);
      try {
        const now = new Date();
        await api.reporting.submit({
          club: clubId,
          period_year: now.getFullYear(),
          period_month: now.getMonth() + 1,
          summary: formData.objective,
          highlights: formData.report_text,
          challenges: formData.lessons_learned,
          status: "submitted",
        });
      } catch {
        // Activity report still succeeded.
      }
      toast.success(
        "Activity Report Submitted!",
        "Report queued for Committee Review. Points applied tentatively to CCEA cycle."
      );

      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }
      onClose();
    } catch (err) {
      toast.error("Submission Failed", err.message || "Failed to submit report.");
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
              <FileText className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Submit Activity Report</h3>
              <p className="text-xs text-sky-100">PRS §6 Narrative Storytelling: Problem → Objective → Results</p>
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
                Activity Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Intermediate Autonomous Rover Lab"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Activity Type
              </label>
              <select
                value={formData.activity_type}
                onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-sky-500"
              >
                <option value="Workshop">Hands-on Workshop</option>
                <option value="Competition">Competition / Challenge</option>
                <option value="Project">Collaborative Project</option>
                <option value="Community Service">Community Service / Outreach</option>
                <option value="Seminar">Guest Lecture / Seminar</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.date_time}
                onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Expected Turnout
              </label>
              <input
                type="number"
                min="1"
                value={formData.expected_participation}
                onChange={(e) => setFormData({ ...formData, expected_participation: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Actual Attendees
              </label>
              <input
                type="number"
                min="1"
                value={formData.actual_participation}
                onChange={(e) => setFormData({ ...formData, actual_participation: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Location / Venue
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-sky-500"
            />
          </div>

          {/* Section: Narrative */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Objective (What we set out to do) *
              </label>
              <span className="text-[10px] text-sky-600 font-semibold">CCEA Criterion 1 & 2</span>
            </div>
            <textarea
              required
              rows={2}
              placeholder="Outline the explicit goal, target skill or institutional contribution..."
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Outcomes & Results (What happened) *
              </label>
              <span className="text-[10px] text-emerald-600 font-semibold">Evidence Cross-Check</span>
            </div>
            <textarea
              required
              rows={3}
              placeholder="Summarize key milestones achieved, participant feedback, and deliverables completed..."
              value={formData.report_text}
              onChange={(e) => setFormData({ ...formData, report_text: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Lessons Learned & Next Steps
            </label>
            <input
              type="text"
              placeholder="e.g. Pre-configure software environments prior to session start"
              value={formData.lessons_learned}
              onChange={(e) => setFormData({ ...formData, lessons_learned: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-sky-500"
            />
          </div>

          {/* Action buttons */}
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
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-sky-600/25 transition-all"
            >
              {submitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <span>Submit Activity Report</span>
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
