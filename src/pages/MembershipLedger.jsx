import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useToast } from "../context/ToastContext";
import { Check, ChevronDown, ChevronRight, Download, ToggleLeft, ToggleRight, Wallet } from "lucide-react";

function moneyLabel(amount, currency) {
  return `${currency} ${amount}`;
}

function ClubRows({ club, open, onToggle, cur, load }) {
  return (
    <>
      <tr className="cursor-pointer border-t border-slate-100 hover:bg-sky-50/60" onClick={onToggle}>
        <td className="px-3 py-3">
          <div className="flex items-center gap-1 font-semibold text-slate-900">
            {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            {club.name}
          </div>
          <div className="text-[10px] text-slate-400">{club.category}</div>
        </td>
        <td className="px-2 py-3 font-semibold">{club.member_count}</td>
        <td className="px-2 py-3 text-emerald-700">{club.exclusive}</td>
        <td className="px-2 py-3">{club.in_2}</td>
        <td className="px-2 py-3">{club.in_3}</td>
        <td className="px-2 py-3">{club.in_4}</td>
        <td className="px-2 py-3">{club.in_5_plus}</td>
        <td className="px-2 py-3">{club.share_units}</td>
        <td className="px-2 py-3 font-semibold">{moneyLabel(club.entitlement, cur)}</td>
        <td className="px-2 py-3">{moneyLabel(club.spent, cur)}</td>
        <td className={`px-2 py-3 ${club.overspent ? "font-bold text-rose-600" : ""}`}>{moneyLabel(club.remaining, cur)}</td>
        <td className="px-2 py-3">
          {club.pct_used}% / {club.pct_remaining}% left
        </td>
        <td className="max-w-[14rem] truncate px-2 py-3 text-slate-500">{club.latest_comment || "—"}</td>
      </tr>
      {open && (
        <tr className="bg-slate-50/80">
          <td colSpan={13} className="px-6 py-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Members</p>
                <ul className="max-h-56 space-y-1 overflow-y-auto text-xs">
                  {club.members.map((m) => (
                    <li key={m.user_id} className="rounded-lg bg-white px-2 py-1.5">
                      <span className="font-semibold">{m.name}</span> · {m.clubs_count} club
                      {m.clubs_count === 1 ? "" : "s"} · share {moneyLabel(m.share, cur)}
                      {m.other_clubs?.length ? (
                        <span className="block text-slate-400">Also: {m.other_clubs.join(", ")}</span>
                      ) : (
                        <span className="block text-emerald-600">Exclusive to this club</span>
                      )}
                    </li>
                  ))}
                  {club.members.length === 0 && <li className="text-slate-400">No confirmed members yet.</li>}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Concept notes</p>
                <ul className="space-y-2 text-xs">
                  {club.concept_notes.map((n) => (
                    <li key={n.id} className="rounded-xl border border-slate-100 bg-white p-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{n.title}</p>
                          <p className="text-slate-500">{n.purpose}</p>
                          <p className="mt-1 text-slate-400">
                            {moneyLabel(n.amount_requested, cur)} · {n.status}
                          </p>
                        </div>
                        {n.status === "submitted" && (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              className="rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white"
                              onClick={async (ev) => {
                                ev.stopPropagation();
                                await api.memberships.approveConceptNote(n.id);
                                await load();
                              }}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="rounded-full bg-slate-200 px-2 py-1 text-[10px] font-semibold"
                              onClick={async (ev) => {
                                ev.stopPropagation();
                                await api.memberships.declineConceptNote(n.id);
                                await load();
                              }}
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                  {club.concept_notes.length === 0 && <li className="text-slate-400">No concept notes yet.</li>}
                </ul>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function MembershipLedger() {
  const { toast } = useToast();
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openRow, setOpenRow] = useState(null);
  const [query, setQuery] = useState("");
  const [grant, setGrant] = useState("7.00");
  const [currency, setCurrency] = useState("USD");
  const [spendClub, setSpendClub] = useState("");
  const [spendAmount, setSpendAmount] = useState("");
  const [spendComment, setSpendComment] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    return api.memberships
      .ledger()
      .then((row) => {
        setPack(row);
        setGrant(row.grant_per_member || "7.00");
        setCurrency(row.currency || "USD");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const clubs = useMemo(() => {
    const rows = pack?.clubs || [];
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((c) => c.name.toLowerCase().includes(q) || (c.category || "").toLowerCase().includes(q));
  }, [pack, query]);

  const windowOpen = !!pack?.window?.open;
  const cur = pack?.currency || "USD";

  const toggleWindow = async () => {
    setBusy(true);
    try {
      await api.memberships.setWindow({
        open: !windowOpen,
        member_grant_amount: grant,
        member_grant_currency: currency,
      });
      toast.success(
        !windowOpen ? "Students can send memberships" : "Membership window closed",
        !windowOpen
          ? "Every student on this campus can declare the clubs they belong to. Confirming a person updates every club they sit on, and the grant splits automatically."
          : "Students cannot send new membership requests until you open this again. Confirmed memberships and budgets stay."
      );
      await load();
    } catch (err) {
      toast.error(err.message || "Could not change the window.");
    } finally {
      setBusy(false);
    }
  };

  const saveGrant = async () => {
    setBusy(true);
    try {
      await api.memberships.setWindow({ member_grant_amount: grant, member_grant_currency: currency });
      toast.success("Grant updated", "Every club's entitlement recalculated from current memberships.");
      await load();
    } catch (err) {
      toast.error(err.message || "Could not save the grant.");
    } finally {
      setBusy(false);
    }
  };

  const confirmPending = async (ids) => {
    try {
      await api.memberships.confirmMany(ids);
      toast.success("Membership confirmed", "Share-weighted grants updated for every club those people belong to.");
      await load();
    } catch (err) {
      toast.error(err.message || "Could not confirm.");
    }
  };

  const recordSpend = async (e) => {
    e.preventDefault();
    try {
      await api.memberships.recordSpend({ club: spendClub, amount: spendAmount, comment: spendComment });
      toast.success("Spend recorded", "Used amount, remaining percentage, and the comment now show on this club's row.");
      setSpendAmount("");
      setSpendComment("");
      await load();
    } catch (err) {
      toast.error(err.message || "Could not record spend.");
    }
  };

  const exportCsv = () => {
    if (!pack) return;
    const header = [
      "Club",
      "Category",
      "Members",
      "Exclusive",
      "Also in 2",
      "Also in 3",
      "Also in 4",
      "Also in 5+",
      "Share units",
      "Entitlement",
      "Spent",
      "Remaining",
      "% used",
      "% remaining",
      "Latest comment",
    ];
    const lines = [
      header.join(","),
      ...clubs.map((c) =>
        [
          `"${c.name}"`,
          `"${c.category || ""}"`,
          c.member_count,
          c.exclusive,
          c.in_2,
          c.in_3,
          c.in_4,
          c.in_5_plus,
          c.share_units,
          c.entitlement,
          c.spent,
          c.remaining,
          c.pct_used,
          c.pct_remaining,
          `"${(c.latest_comment || "").replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ClubConnect_Membership_Ledger_${pack.academic_year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <div className="morning-hero mb-6 rounded-3xl p-8 shadow-sm">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-sky-600">Clubs &amp; Societies Committee Head</p>
        <h1 className="text-3xl font-bold text-slate-900">Membership and shared grant</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Each student is funded once at the campus grant. If they belong only to one club, that club receives the full amount.
          If they belong to several, those clubs share that student&apos;s grant equally. Confirm a membership here and every
          club they sit on, and the remaining budget, updates at once.
        </p>
      </div>

      {loading || !pack ? (
        <div className="h-40 animate-pulse rounded-3xl bg-white" />
      ) : (
        <>
          <div className="mb-6 grid gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Campus pot</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{moneyLabel(pack.campus.pot, cur)}</p>
              <p className="text-[11px] text-slate-400">
                {pack.campus.unique_members} unique members × {moneyLabel(pack.grant_per_member, cur)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Exclusive members</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{pack.campus.exclusive_members}</p>
              <p className="text-[11px] text-slate-400">Belong to one club only — full grant stays there</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Sharing members</p>
              <p className="mt-1 text-2xl font-bold text-sky-700">{pack.campus.sharing_members}</p>
              <p className="text-[11px] text-slate-400">Their grant is split across every club they belong to</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Remaining this year</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{moneyLabel(pack.campus.remaining, cur)}</p>
              <p className="text-[11px] text-slate-400">Used {moneyLabel(pack.campus.spent, cur)}</p>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-sky-100 bg-white p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Student membership window</p>
              <p className="mt-1 max-w-xl text-xs text-slate-500">
                When this is on, students send the clubs they belong to. You or a club leader confirm. When it is off, they
                cannot send new requests.
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={toggleWindow}
                className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
                  windowOpen ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {windowOpen ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                {windowOpen ? "Window is open" : "Window is closed"}
              </button>
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <label className="text-[11px] font-bold uppercase text-slate-500">
                Grant / unique student
                <input
                  value={grant}
                  onChange={(e) => setGrant(e.target.value)}
                  className="mt-1 block w-28 rounded-xl border border-slate-200 px-2 py-1.5 text-sm"
                />
              </label>
              <label className="text-[11px] font-bold uppercase text-slate-500">
                Currency
                <input
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                  className="mt-1 block w-20 rounded-xl border border-slate-200 px-2 py-1.5 text-sm"
                />
              </label>
              <button
                type="button"
                onClick={saveGrant}
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              >
                Recalculate
              </button>
              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                <Download className="h-3.5 w-3.5" /> CSV
              </button>
            </div>
          </div>

          {pack.pending?.length > 0 && (
            <div className="mb-6 rounded-3xl border border-amber-100 bg-amber-50/60 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">Waiting for confirmation</h2>
                <button
                  type="button"
                  onClick={() => confirmPending(pack.pending.map((p) => p.id))}
                  className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Confirm all
                </button>
              </div>
              <ul className="space-y-2">
                {pack.pending.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm">
                    <span>
                      <span className="font-semibold">{p.user_name}</span>{" "}
                      <span className="text-slate-400">{p.user_email}</span> → {p.club_name}
                    </span>
                    <button
                      type="button"
                      onClick={() => confirmPending([p.id])}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
                    >
                      <Check className="h-3.5 w-3.5" /> Confirm
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-bold text-slate-900">Recognised clubs · membership mix · grant</h2>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a club"
              className="w-56 rounded-full border border-slate-200 px-3 py-1.5 text-sm"
            />
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-sm">
            <table className="min-w-[1200px] w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-3 py-3">Club</th>
                  <th className="px-2 py-3">Members</th>
                  <th className="px-2 py-3">Only this club</th>
                  <th className="px-2 py-3">Also 1 other</th>
                  <th className="px-2 py-3">Also 2 others</th>
                  <th className="px-2 py-3">Also 3 others</th>
                  <th className="px-2 py-3">Also 4+ others</th>
                  <th className="px-2 py-3">Share units</th>
                  <th className="px-2 py-3">Entitlement</th>
                  <th className="px-2 py-3">Used</th>
                  <th className="px-2 py-3">Remaining</th>
                  <th className="px-2 py-3">% used</th>
                  <th className="px-2 py-3">Comment</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((club) => (
                  <ClubRows
                    key={club.id}
                    club={club}
                    open={openRow === club.id}
                    onToggle={() => setOpenRow(openRow === club.id ? null : club.id)}
                    cur={cur}
                    load={load}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <form onSubmit={recordSpend} className="mt-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-1 flex items-center gap-2 font-bold text-slate-900">
              <Wallet className="h-4 w-4 text-sky-600" /> Record amount used
            </h3>
            <p className="mb-3 text-xs text-slate-500">
              When a club has spent part of its entitlement, write what it paid for. Used %, remaining %, and the comment
              update on the table immediately.
            </p>
            <div className="grid gap-2 sm:grid-cols-4">
              <select
                required
                value={spendClub}
                onChange={(e) => setSpendClub(e.target.value)}
                className="rounded-xl border border-slate-200 px-2 py-2 text-sm"
              >
                <option value="">Club</option>
                {(pack.clubs || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={spendAmount}
                onChange={(e) => setSpendAmount(e.target.value)}
                placeholder={`Amount (${cur})`}
                className="rounded-xl border border-slate-200 px-2 py-2 text-sm"
              />
              <input
                required
                value={spendComment}
                onChange={(e) => setSpendComment(e.target.value)}
                placeholder="Used to…"
                className="rounded-xl border border-slate-200 px-2 py-2 text-sm sm:col-span-2"
              />
            </div>
            <button type="submit" className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
              Save spend
            </button>
          </form>
        </>
      )}
    </div>
  );
}
