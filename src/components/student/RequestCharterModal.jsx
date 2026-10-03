import { useState } from "react";
import { X, Landmark } from "lucide-react";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";

export function RequestCharterModal({ isOpen, onClose, onCreated }) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Academic",
    mission: "",
    charter_statement: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.charter_statement.trim()) {
      toast.warning("Incomplete charter", "Name and a short case for recognition are required.");
      return;
    }
    setSubmitting(true);
    try {
      const club = await api.clubs.requestCharter(form);
      toast.success("Charter submitted", `${club.name} is pending recognition by committee or institutional leadership.`);
      onCreated?.(club);
      onClose();
    } catch (err) {
      toast.error("Could not submit charter", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-sky-600 px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            <div>
              <h3 className="font-bold">Request club registration</h3>
              <p className="text-xs text-sky-100">Stays pending until ALCHE committee / leadership recognises it.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-white/15">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 p-5">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Club name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Category (e.g. Technology, Culture, Service)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <textarea
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            rows={2}
            placeholder="Mission"
            value={form.mission}
            onChange={(e) => setForm({ ...form, mission: e.target.value })}
          />
          <textarea
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            rows={3}
            placeholder="Why should this club be recognised at your institution?"
            value={form.charter_statement}
            onChange={(e) => setForm({ ...form, charter_statement: e.target.value })}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white"
          >
            {submitting ? "Submitting…" : "Submit for recognition"}
          </button>
        </form>
      </div>
    </div>
  );
}
