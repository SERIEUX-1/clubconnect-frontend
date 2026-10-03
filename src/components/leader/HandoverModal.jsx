import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const CLUB_POSITIONS = [
  "Club leader",
  "President",
  "Vice president",
  "Secretary",
  "Treasurer",
  "Events officer",
  "Communications",
  "Officer",
];

const CAMPUS_POSITIONS = [
  "Committee Head",
  "Deputy committee head",
  "Secretary",
  "Awards officer",
  "Member",
];

function CommitteeTable({ title, hint, rows, onChange, positions, emptyPosition }) {
  const setRow = (index, patch) => {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-700">{title}</p>
      <p className="mb-2 mt-0.5 text-[11px] text-slate-500">{hint}</p>
      <div className="space-y-2">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-2 sm:grid-cols-[1fr_1fr_10rem_auto]"
          >
            <input
              required
              value={row.name}
              onChange={(e) => setRow(index, { name: e.target.value })}
              placeholder="Full name"
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
            />
            <input
              required
              type="email"
              value={row.email}
              onChange={(e) => setRow(index, { email: e.target.value })}
              placeholder="campus@alustudent.com"
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
            />
            <select
              value={positions.includes(row.position) ? row.position : emptyPosition}
              onChange={(e) => setRow(index, { position: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm"
            >
              {positions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
              className="inline-flex items-center justify-center rounded-lg px-2 py-1.5 text-slate-400 hover:bg-white hover:text-rose-600"
              aria-label="Remove person"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...rows, { name: "", email: "", position: emptyPosition }])}
        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-sky-700"
      >
        <Plus className="h-3.5 w-3.5" /> Add a person
      </button>
    </div>
  );
}

export function HandoverModal({ isOpen, onClose, clubId, currentOfficers = [], variant = "club" }) {
  const campus = variant === "campus";
  const positions = campus ? CAMPUS_POSITIONS : CLUB_POSITIONS;
  const leadPosition = campus ? "Committee Head" : "Club leader";
  const emptyPosition = campus ? "Member" : "Officer";
  const { user } = useAuth();
  const { toast } = useToast();
  const [outgoing, setOutgoing] = useState([]);
  const [incoming, setIncoming] = useState([{ name: "", email: "", position: leadPosition }]);
  const [notes, setNotes] = useState("");
  const [achievements, setAchievements] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fromProps = (currentOfficers || [])
      .filter((m) => m.role === "leader" || m.role === "officer")
      .map((m) => ({
        name: m.user_name || "",
        email: m.user_email || "",
        position: m.role === "leader" ? "Club leader" : "Officer",
      }));
    const seed = fromProps.length
      ? fromProps
      : [
          {
            name: user?.full_name || "",
            email: user?.email || "",
            position: leadPosition,
          },
        ];
    setOutgoing(seed);
    setIncoming([{ name: "", email: "", position: leadPosition }]);
    setNotes("");
    setAchievements("");
    if (campus) {
      api.admin
        .currentCampusCommittee()
        .then((pack) => {
          if (Array.isArray(pack?.outgoing_committee) && pack.outgoing_committee.length) {
            setOutgoing(pack.outgoing_committee);
          }
        })
        .catch(() => {});
    } else if (clubId) {
      api.clubs
        .currentCommittee(clubId)
        .then((pack) => {
          if (Array.isArray(pack?.outgoing_committee) && pack.outgoing_committee.length) {
            setOutgoing(pack.outgoing_committee);
          }
        })
        .catch(() => {});
    }
    // Seed once per open so typing is not wiped by auth refreshes or the current-committee fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, clubId, campus, leadPosition]);

  if (!isOpen) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!campus && !clubId) {
      toast.error("No club", "This account is not attached to a club to hand over.");
      return;
    }
    setSaving(true);
    try {
      if (campus) {
        await api.admin.submitCampusHandover({
          outgoing_committee: outgoing,
          incoming_committee: incoming,
          notes,
          achievements_summary: achievements,
        });
        toast.success(
          "Sent to the campus administrator",
          "When they confirm, the incoming Committee Head receives that office and you lose it."
        );
      } else {
        await api.clubs.nominateHandover({
          club: clubId,
          outgoing_committee: outgoing,
          incoming_committee: incoming,
          notes,
          achievements_summary: achievements,
        });
        toast.success(
          "Sent to the Committee Head",
          "When they confirm, incoming people receive office permissions and outgoing leaders lose them."
        );
      }
      onClose();
    } catch (err) {
      toast.error(err.message || "Could not submit handover.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-slate-900 px-6 py-4 text-white">
          <div>
            <h3 className="text-lg font-bold">
              {campus ? "Committee Head handover" : "Club committee handover"}
            </h3>
            <p className="text-xs text-slate-300">
              {campus
                ? "Submit the outgoing and incoming Clubs & Societies committee to the campus administrator. They confirm once; ClubConnect switches the Committee Head role."
                : "Submit the outgoing and incoming committee to the Committee Head. They confirm once; ClubConnect switches offices."}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 hover:bg-white/20">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-5 overflow-y-auto p-6">
          <CommitteeTable
            title="Outgoing committee"
            hint={
              campus
                ? "Everyone leaving the campus committee, including you as Committee Head."
                : "Everyone leaving office, including you as club leader."
            }
            rows={outgoing}
            onChange={setOutgoing}
            positions={positions}
            emptyPosition={emptyPosition}
          />
          <CommitteeTable
            title="Incoming committee"
            hint={
              campus
                ? "People taking campus committee office. At least one must be Committee Head, with a licensed campus ClubConnect account."
                : "People taking office. At least one must be Club leader or President. They need a campus ClubConnect account."
            }
            rows={incoming}
            onChange={setIncoming}
            positions={positions}
            emptyPosition={emptyPosition}
          />
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            What this year achieved
            <textarea
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal normal-case"
              rows={2}
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Private notes for the next committee
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal normal-case"
              rows={2}
            />
          </label>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Sending…" : campus ? "Submit to campus administrator" : "Submit to Committee Head"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
