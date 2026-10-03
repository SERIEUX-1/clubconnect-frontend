import React, { useEffect, useState } from "react";
import { Sliders, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { api } from "../../lib/api";

function domainListToText(value) {
  if (Array.isArray(value)) return value.join(", ");
  return String(value || "");
}

function textToDomainList(value) {
  return String(value || "")
    .split(/[,\s]+/)
    .map((item) => item.trim().toLowerCase().replace(/^@/, ""))
    .filter(Boolean);
}

export function SystemSettingsModal({ isOpen, onClose }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    student_email_domains: "",
    staff_email_domains: "",
    awards_enabled: true,
    awards_program_name: "Campus Clubs Excellence Awards",
    academic_year_start_month: 8,
    academic_year_label: "",
    report_deadline_day: 5,
    privacy_contact_email: "",
  });
  const [onboarding, setOnboarding] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    api.admin
      .getCampusInstitution()
      .then((row) => {
        setSettings({
          student_email_domains: domainListToText(row.student_email_domains),
          staff_email_domains: domainListToText(row.staff_email_domains),
          awards_enabled: Boolean(row.awards_enabled),
          awards_program_name: row.awards_program_name || "Campus Clubs Excellence Awards",
          academic_year_start_month: row.academic_year_start_month || 8,
          academic_year_label: row.academic_year_label || "",
          report_deadline_day: row.report_deadline_day || 5,
          privacy_contact_email: row.privacy_contact_email || "",
        });
      })
      .catch((err) => toast.error(err.message || "Could not load campus settings."));
    api.admin.getOnboarding().then(setOnboarding).catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.admin.updateCampusInstitution({
        student_email_domains: textToDomainList(settings.student_email_domains),
        staff_email_domains: textToDomainList(settings.staff_email_domains),
        awards_enabled: settings.awards_enabled,
        awards_program_name: settings.awards_program_name,
        academic_year_start_month: Number(settings.academic_year_start_month) || 8,
        academic_year_label: settings.academic_year_label,
        report_deadline_day: Number(settings.report_deadline_day) || 5,
        privacy_contact_email: settings.privacy_contact_email,
      });
      toast.success("Campus settings saved", "Sign-in domains and awards programme updated for this institution only.");
      onClose();
    } catch (err) {
      toast.error(err.message || "Could not save campus settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-violet-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Campus settings</h3>
              <p className="text-xs text-slate-300">Who may sign in, and whether this campus runs awards</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-4">
          <label className="block">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Student email domains</span>
            <input
              value={settings.student_email_domains}
              onChange={(e) => setSettings({ ...settings, student_email_domains: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="alustudent.com"
            />
            <span className="mt-1 block text-[11px] text-slate-400">Comma-separated. Like Google Workspace primary domain plus aliases.</span>
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Staff / lecturer email domains</span>
            <input
              value={settings.staff_email_domains}
              onChange={(e) => setSettings({ ...settings, staff_email_domains: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="alueducation.com"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Awards programme name</span>
            <input
              value={settings.awards_program_name}
              onChange={(e) => setSettings({ ...settings, awards_program_name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={settings.awards_enabled}
              onChange={(e) => setSettings({ ...settings, awards_enabled: e.target.checked })}
            />
            Awards enabled for this campus (the Committee Head still publishes results)
          </label>
          {onboarding?.items && (
            <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Campus opening checklist</p>
              <p className="mt-1 text-[11px] text-slate-500">Academic year {onboarding.academic_year || "—"}</p>
              <ul className="mt-2 space-y-1">
                {onboarding.items.map((item) => (
                  <li key={item.key} className="text-xs text-slate-700">
                    {item.done ? "✓" : "○"} {item.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <label className="block">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Academic year start month (1–12)</span>
            <input
              type="number"
              min="1"
              max="12"
              value={settings.academic_year_start_month}
              onChange={(e) => setSettings({ ...settings, academic_year_start_month: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Academic year label (optional)</span>
            <input
              value={settings.academic_year_label}
              onChange={(e) => setSettings({ ...settings, academic_year_label: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="2025-2026"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Monthly report deadline day</span>
            <input
              type="number"
              min="1"
              max="28"
              value={settings.report_deadline_day}
              onChange={(e) => setSettings({ ...settings, report_deadline_day: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Data-protection contact email</span>
            <input
              type="email"
              value={settings.privacy_contact_email}
              onChange={(e) => setSettings({ ...settings, privacy_contact_email: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save campus settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
