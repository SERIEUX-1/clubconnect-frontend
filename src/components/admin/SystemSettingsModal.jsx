import React, { useState } from "react";
import { Sliders, X, Shield, CheckCircle2, ArrowRight } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export function SystemSettingsModal({ isOpen, onClose }) {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    quorumPercentage: 80,
    reportGraceDays: 5,
    aiStrictness: "moderate",
    qrDurationHours: 3,
    enforceAdvisorSignoff: true,
    allowAnonymousReporting: false,
  });

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("System Settings Applied", "Governance policies updated across all campus instances.");
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-violet-300 shadow-inner">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Configure System Settings</h3>
              <p className="text-xs text-slate-300">Global Governance & Cryptographic Policy</p>
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
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                CCEA Attendance Quorum Threshold ({settings.quorumPercentage}%)
              </label>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={settings.quorumPercentage}
                onChange={(e) => setSettings({ ...settings, quorumPercentage: Number(e.target.value) })}
                className="w-full accent-sky-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Minimum verified attendee count required to substantiate full activity scoring points.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Report Grace Period
                </label>
                <select
                  value={settings.reportGraceDays}
                  onChange={(e) => setSettings({ ...settings, reportGraceDays: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800"
                >
                  <option value={3}>3 Days Post-Event</option>
                  <option value={5}>5 Days Post-Event (Standard)</option>
                  <option value={7}>7 Days Post-Event</option>
                  <option value={14}>14 Days (Extended)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  QR Token Validity Window
                </label>
                <select
                  value={settings.qrDurationHours}
                  onChange={(e) => setSettings({ ...settings, qrDurationHours: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800"
                >
                  <option value={2}>2 Hours</option>
                  <option value={3}>3 Hours (Default)</option>
                  <option value={6}>6 Hours</option>
                  <option value={12}>12 Hours (All-Day Event)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                AI Moderation Strictness
              </label>
              <select
                value={settings.aiStrictness}
                onChange={(e) => setSettings({ ...settings, aiStrictness: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800"
              >
                <option value="permissive">Permissive (Notify Only)</option>
                <option value="moderate">Moderate Concordance (Highlight Discrepancies)</option>
                <option value="strict">Strict (Flag for Secondary Committee Audit)</option>
              </select>
            </div>

            <div className="pt-2 space-y-2.5">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enforceAdvisorSignoff}
                  onChange={(e) => setSettings({ ...settings, enforceAdvisorSignoff: e.target.checked })}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="font-medium">Require Faculty / Staff Advisor sign-off on monthly narrative reports</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowAnonymousReporting}
                  onChange={(e) => setSettings({ ...settings, allowAnonymousReporting: e.target.checked })}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="font-medium">Enable confidential student feedback on club events</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              {saving ? "Saving..." : "Save Governance Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
