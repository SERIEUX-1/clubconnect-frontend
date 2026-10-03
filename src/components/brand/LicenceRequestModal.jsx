import { useState } from "react";
import { X } from "lucide-react";
import { ClubConnectMark } from "./ClubConnectLogo";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { useI18n } from "../../i18n/I18nProvider";

const KINDS = [
  { id: "university", label: "University / college" },
  { id: "high_school", label: "High school" },
  { id: "organization", label: "Organisation" },
];

export function LicenceRequestModal({ open, onClose }) {
  const { toast } = useToast();
  const { t } = useI18n();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    institution_name: "",
    country: "",
    city: "",
    kind: "university",
    contact_name: "",
    contact_role: "",
    contact_email: "",
    contact_phone: "",
    student_email_domain: "",
    staff_email_domain: "",
    message: "",
  });

  if (!open) return null;

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.licence.request(form);
      setSent(true);
      toast.success("Request received", "ClubConnect will reply to the campus contact email.");
    } catch (err) {
      toast.error("Could not send request", err.message || "Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e3a5f]/35 backdrop-blur-md">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/70 bg-[rgba(255,250,244,0.97)] shadow-island flex flex-col max-h-[90vh]">
        <div className="relative flex items-center justify-between px-6 pb-5 pt-6 text-white cc-dusk">
          <div className="flex items-center space-x-3">
            <ClubConnectMark size={40} />
            <div>
              <h2 className="font-display text-2xl tracking-tight">{t("licence.title")}</h2>
              <p className="text-xs text-white/80 font-medium">{t("licence.sub")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center">
            <p className="font-display text-2xl text-[#1e3a5f]">We have your request.</p>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              The ClubConnect operator will contact <strong>{form.contact_email}</strong> to confirm
              student and staff domains, name a campus administrator, set the academic year, and
              agree a data-processing arrangement before the campus opens. This is a licence, not a
              public social network.
            </p>
            <button type="button" onClick={onClose} className="sun-cta mt-8 rounded-full px-6 py-2.5 text-sm font-semibold text-white">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-3">
            <p className="text-sm text-slate-600 leading-relaxed">
              Do not create a Gmail account here. Tell us who you are. We licence the institution, then your people sign in with school mail.
            </p>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Institution name</span>
              <input required value={form.institution_name} onChange={set("institution_name")} className="mt-1 w-full rounded-2xl border border-sky-100 bg-white/80 px-3 py-2 text-sm" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Country</span>
                <input value={form.country} onChange={set("country")} className="mt-1 w-full rounded-2xl border border-sky-100 bg-white/80 px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">City</span>
                <input value={form.city} onChange={set("city")} className="mt-1 w-full rounded-2xl border border-sky-100 bg-white/80 px-3 py-2 text-sm" />
              </label>
            </div>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Kind of campus</span>
              <select value={form.kind} onChange={set("kind")} className="mt-1 w-full rounded-2xl border border-sky-100 bg-white/80 px-3 py-2 text-sm">
                {KINDS.map((k) => (
                  <option key={k.id} value={k.id}>{k.label}</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Your name</span>
                <input required value={form.contact_name} onChange={set("contact_name")} className="mt-1 w-full rounded-2xl border border-sky-100 bg-white/80 px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Your role</span>
                <input value={form.contact_role} onChange={set("contact_role")} placeholder="Dean, registrar, IT…" className="mt-1 w-full rounded-2xl border border-sky-100 bg-white/80 px-3 py-2 text-sm" />
              </label>
            </div>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Work email we should reply to</span>
              <input required type="email" value={form.contact_email} onChange={set("contact_email")} className="mt-1 w-full rounded-2xl border border-sky-100 bg-white/80 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Phone (optional)</span>
              <input value={form.contact_phone} onChange={set("contact_phone")} className="mt-1 w-full rounded-2xl border border-sky-100 bg-white/80 px-3 py-2 text-sm" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Student email domain</span>
                <input value={form.student_email_domain} onChange={set("student_email_domain")} placeholder="student.campus.ac.mu" className="mt-1 w-full rounded-2xl border border-sky-100 bg-white/80 px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Staff email domain</span>
                <input value={form.staff_email_domain} onChange={set("staff_email_domain")} placeholder="campus.ac.mu" className="mt-1 w-full rounded-2xl border border-sky-100 bg-white/80 px-3 py-2 text-sm" />
              </label>
            </div>
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Why ClubConnect, and when</span>
              <textarea rows={3} value={form.message} onChange={set("message")} className="mt-1 w-full rounded-2xl border border-sky-100 bg-white/80 px-3 py-2 text-sm" />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="sun-cta w-full rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send licence request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
