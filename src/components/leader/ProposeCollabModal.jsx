import React, { useState } from "react";
import { Handshake, X, Sparkles, ArrowRight, PlusCircle } from "lucide-react";
import { MOCK_CLUBS } from "../../data/mockClubs";
import { useToast } from "../../context/ToastContext";

export function ProposeCollabModal({ isOpen, onClose, currentClubId, currentClubName, onCollabProposed }) {
  const { toast } = useToast();

  const otherClubs = MOCK_CLUBS.filter((c) => c.id !== (currentClubId || "1"));

  const [formData, setFormData] = useState({
    partner_club: otherClubs[0]?.name || "Environmental Action Collective",
    title: "",
    objectives: "",
    proposed_date: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10),
    expected_beneficiaries: "120+ campus students",
  });

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.objectives.trim()) {
      toast.warning("Missing Information", "Please enter project title and joint objectives.");
      return;
    }

    setSubmitting(true);
    try {
      const newCollab = {
        id: "col-" + Date.now(),
        partner_club: formData.partner_club,
        title: formData.title,
        status: "pending_partner_acceptance",
        proposed_date: formData.proposed_date,
        initiator: currentClubName || "Robotics & AI Society",
      };

      toast.success(
        "Collaboration Proposed!",
        `Invitation sent to ${formData.partner_club}. Confirmed partnerships earn up to 10 CCEA bonus points!`
      );

      if (onCollabProposed) {
        onCollabProposed(newCollab);
      }
      onClose();
    } catch (err) {
      toast.error("Proposal Failed", err.message || "Could not submit collaboration proposal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Handshake className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Propose Club Collaboration</h3>
              <p className="text-xs text-amber-100">Cross-Disciplinary Campus Partnership Initiative</p>
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
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Partner Club *
            </label>
            <select
              value={formData.partner_club}
              onChange={(e) => setFormData({ ...formData, partner_club: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-amber-500"
            >
              {otherClubs.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Joint Initiative Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Solar-Powered Autonomous Micro-Weather Stations"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Timeline
              </label>
              <input
                type="date"
                value={formData.proposed_date}
                onChange={(e) => setFormData({ ...formData, proposed_date: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Beneficiaries
              </label>
              <input
                type="text"
                value={formData.expected_beneficiaries}
                onChange={(e) => setFormData({ ...formData, expected_beneficiaries: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Collaboration Objectives & Cross-Discipline Synergy *
              </label>
              <span className="text-[10px] text-amber-700 font-bold">+10 CCEA Bonus</span>
            </div>
            <textarea
              required
              rows={3}
              placeholder="How will both societies contribute distinct skills and broaden campus student reach?..."
              value={formData.objectives}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-500"
            />
          </div>

          {/* Submit buttons */}
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
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-amber-500/25 transition-all"
            >
              {submitting ? (
                <span>Dispatching Proposal...</span>
              ) : (
                <>
                  <span>Send Collaboration Proposal</span>
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
