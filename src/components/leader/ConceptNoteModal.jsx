import { useState } from "react";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { X } from "lucide-react";

export function ConceptNoteModal({ isOpen, onClose, clubId, currency = "USD" }) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.memberships.submitConceptNote({
        club: clubId,
        title,
        purpose,
        amount_requested: amount,
      });
      toast.success("Concept note sent", "The Committee Head sees the request on the membership ledger. Approving it reserves that share of the grant.");
      setTitle("");
      setPurpose("");
      setAmount("");
      onClose();
    } catch (err) {
      toast.error(err.message || "Could not send the concept note.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="w-full max-w-lg rounded-3xl border border-sky-100 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Concept note</h3>
            <p className="text-xs text-slate-500">
              Request part of this club&apos;s share-weighted grant. The Committee Head confirms; spent amounts then show on the campus ledger.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-600">
          Title
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal normal-case"
          />
        </label>
        <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-600">
          Amount ({currency})
          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal normal-case"
          />
        </label>
        <label className="mb-4 block text-xs font-bold uppercase tracking-wider text-slate-600">
          What the money will do
          <textarea
            required
            rows={4}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal normal-case"
          />
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
            {saving ? "Sending…" : "Submit to Committee Head"}
          </button>
        </div>
      </form>
    </div>
  );
}
