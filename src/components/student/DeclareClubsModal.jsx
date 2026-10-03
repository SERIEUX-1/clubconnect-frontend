import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import { X } from "lucide-react";

export function DeclareClubsModal({ isOpen, onClose, onSubmitted }) {
  const { toast } = useToast();
  const [pack, setPack] = useState(null);
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    api.memberships.window().then((row) => {
      setPack(row);
      const mine = (row.my_club_ids || []).map(String);
      setSelected(mine);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const toggle = (id) => {
    const key = String(id);
    setSelected((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!pack?.open) {
      toast.error("Window closed", "The Committee Head has not opened membership requests.");
      return;
    }
    if (!selected.length) {
      toast.error("Select clubs", "Tick every recognised club you belong to.");
      return;
    }
    setSaving(true);
    try {
      const res = await api.memberships.declare(selected);
      toast.success(
        "Sent for confirmation",
        `${res.count || selected.length} club(s) will count for the shared grant after a leader or the Committee Head confirms.`
      );
      onSubmitted?.();
      onClose();
    } catch (err) {
      toast.error(err.message || "Could not send membership requests.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between bg-slate-900 px-5 py-4 text-white">
          <div>
            <h3 className="text-lg font-bold">Clubs I belong to</h3>
            <p className="text-xs text-slate-300">
              One form, every recognised club. Confirming you updates that club&apos;s member count and its share of the campus grant.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 hover:bg-white/20">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[55vh] space-y-2 overflow-y-auto p-5">
          {!pack?.open && (
            <p className="rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
              The Committee Head has closed this window. You cannot send membership requests until they open it.
            </p>
          )}
          {(pack?.recognised_clubs || []).map((club) => (
            <label key={club.id} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-100 px-3 py-2 hover:bg-sky-50">
              <input
                type="checkbox"
                checked={selected.includes(String(club.id))}
                onChange={() => toggle(club.id)}
                disabled={!pack?.open}
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">{club.name}</span>
                <span className="text-[11px] text-slate-400">{club.category}</span>
              </span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !pack?.open}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Sending…" : "Submit for confirmation"}
          </button>
        </div>
      </form>
    </div>
  );
}
