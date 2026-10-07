import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../lib/api";
import { InstitutionalNoticeModal } from "../components/dean/InstitutionalNoticeModal";

export function StudentLifeDesk() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [desk, setDesk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [reasons, setReasons] = useState({});
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [fineOpen, setFineOpen] = useState(false);

  const load = () => {
    setLoading(true);
    api.studentLife
      .desk()
      .then(setDesk)
      .catch((err) => toast.error(err.message || "Could not open the Student Life desk."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const reasonFor = (id) => (reasons[id] || "").trim();

  const run = async (id, action) => {
    const reason = reasonFor(id);
    if ((action === "pause" || action === "restore") && reason.length < 8) {
      toast.error("Write a short reason first.");
      return;
    }
    setBusyId(id);
    try {
      if (action === "recognize") await api.clubs.recognize(id);
      if (action === "return") await api.clubs.rejectCharter(id);
      if (action === "pause") await api.clubs.pause(id, reason);
      if (action === "restore") await api.clubs.restore(id, reason);
      toast.success("Saved");
      load();
    } catch (err) {
      toast.error(err.message || "That did not save.");
    } finally {
      setBusyId("");
    }
  };

  const toggleWindow = async () => {
    try {
      await api.memberships.setWindow({ open: !desk.membership_open });
      toast.success(desk.membership_open ? "Membership window closed" : "Membership window open");
      load();
    } catch (err) {
      toast.error(err.message || "Could not change the membership window.");
    }
  };

  const downloadBrief = async () => {
    try {
      const brief = await api.admin.getCampusBrief();
      const blob = new Blob([brief.text || ""], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ClubConnect_StudentLife_${brief.academic_year || "brief"}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err.message || "Could not download the brief.");
    }
  };

  const campus = user?.institution?.short_name || "Campus";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <section className="community-frame px-6 py-7 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5F92B2]">Student Life · {campus}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#101314]">This morning</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5E6E81]">
              Charters, quiet clubs, and the membership window. Leaders keep the records. The committee keeps the award scores.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={downloadBrief} className="rounded-xl border border-[#E4E7EE] bg-white px-3.5 py-2 text-xs font-semibold text-[#101314] hover:border-[#3b9be8]">
              Download brief
            </button>
            <button type="button" onClick={() => setNoticeOpen(true)} className="sun-cta rounded-xl px-3.5 py-2 text-xs font-semibold text-white">
              Write to campus
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F7F8FB] px-4 py-3">
          <p className="text-sm text-[#101314]">
            Membership window is <strong>{desk?.membership_open ? "open" : "closed"}</strong>
            {desk?.grant_amount ? ` · grant ${desk.grant_currency} ${desk.grant_amount} per student` : ""}
          </p>
          <button type="button" onClick={toggleWindow} disabled={!desk} className="rounded-lg bg-[#101314] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40">
            {desk?.membership_open ? "Close window" : "Open window"}
          </button>
        </div>

        {loading && <p className="mt-8 text-sm text-[#5E6E81]">Opening the desk…</p>}

        {desk && (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Pile title="Waiting on you" count={desk.waiting.length} hint="A charter or a club you paused.">
              {desk.waiting.length === 0 && <Empty>Nothing is waiting. Leave this closed.</Empty>}
              {desk.waiting.map((item) => (
                <article key={item.id} className="rounded-2xl border border-[#EEF0F5] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#5F92B2]">{item.kind === "paused" ? "Paused" : item.category || "Charter"}</p>
                  <h3 className="mt-1 text-base font-semibold text-[#101314]">{item.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#5E6E81]">{item.detail}</p>
                  <Reason value={reasons[item.id] || ""} onChange={(value) => setReasons((current) => ({ ...current, [item.id]: value }))} />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.kind === "charter" ? (
                      <>
                        <Action disabled={busyId === item.id} onClick={() => run(item.id, "recognize")}>Recognise</Action>
                        <Ghost disabled={busyId === item.id} onClick={() => run(item.id, "return")}>Return</Ghost>
                      </>
                    ) : (
                      <Action disabled={busyId === item.id} onClick={() => run(item.id, "restore")}>Restore</Action>
                    )}
                    <Link to={`/clubs/${item.id}`} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#5F92B2] hover:text-[#101314]">Open passport</Link>
                  </div>
                </article>
              ))}
            </Pile>

            <Pile title="Going quiet" count={(desk.quiet.length || 0) + (desk.quiet_more || 0)} hint="The reminders already went to the leaders. Only the sharpest gaps are listed.">
              {desk.quiet.length === 0 && <Empty>No club is sitting in silence.</Empty>}
              {desk.quiet.map((item) => (
                <article key={item.id} className="rounded-2xl border border-[#EEF0F5] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#D98E04]">{item.band === "at_risk" ? "At risk" : "Needs a look"}{item.score != null ? ` · ${item.score}/100` : ""}</p>
                  <h3 className="mt-1 text-base font-semibold text-[#101314]">{item.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#5E6E81]">{item.detail}</p>
                  <Reason value={reasons[item.id] || ""} onChange={(value) => setReasons((current) => ({ ...current, [item.id]: value }))} />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Ghost disabled={busyId === item.id} onClick={() => run(item.id, "pause")}>Pause</Ghost>
                    <Link to={`/clubs/${item.id}`} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#5F92B2] hover:text-[#101314]">Open passport</Link>
                  </div>
                </article>
              ))}
              {desk.quiet_more > 0 && (
                <p className="rounded-2xl bg-[#F7F8FB] px-4 py-3 text-sm text-[#5E6E81]">
                  {desk.quiet_more} more clubs have the same gap. Their leaders already have the reminder. You do not need to open them one by one.
                </p>
              )}
            </Pile>
          </div>
        )}

        {desk && (
          <div className="mt-6 rounded-2xl border border-[#EEF0F5] bg-[#FBFBFD]">
            <button type="button" onClick={() => setFineOpen((open) => !open)} className="flex w-full items-center justify-between px-4 py-3 text-left">
              <span>
                <span className="block text-sm font-semibold text-[#101314]">Already fine</span>
                <span className="text-xs text-[#5E6E81]">{desk.fine_count} clubs filed what this month asks. Leave them closed.</span>
              </span>
              <span className="text-xs font-semibold text-[#5E6E81]">{fineOpen ? "Hide" : "Show"}</span>
            </button>
            {fineOpen && (
              <p className="border-t border-[#EEF0F5] px-4 py-3 text-sm text-[#5E6E81]">
                These clubs have a report, an event, or both. Open one from Discover only if a student asks.
              </p>
            )}
          </div>
        )}
      </section>
      <InstitutionalNoticeModal isOpen={noticeOpen} onClose={() => setNoticeOpen(false)} />
    </div>
  );
}

function Pile({ title, count, hint, children }) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-[#101314]">{title}</h2>
        <span className="rounded-full bg-[#101314] px-2 py-0.5 text-[11px] font-semibold text-white">{count}</span>
      </div>
      <p className="mb-3 text-xs text-[#8b93a7]">{hint}</p>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Empty({ children }) {
  return <p className="rounded-2xl border border-dashed border-[#E4E7EE] px-4 py-6 text-sm text-[#5E6E81]">{children}</p>;
}

function Reason({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Reason, if you pause, return, or restore"
      className="mt-3 w-full rounded-xl border border-[#E4E7EE] bg-[#FBFBFD] px-3 py-2 text-sm text-[#101314] placeholder:text-[#8b93a7]"
    />
  );
}

function Action({ children, ...props }) {
  return <button type="button" className="rounded-lg bg-[#3b9be8] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2b8ad4] disabled:opacity-40" {...props}>{children}</button>;
}

function Ghost({ children, ...props }) {
  return <button type="button" className="rounded-lg border border-[#E4E7EE] bg-white px-3 py-1.5 text-xs font-semibold text-[#101314] hover:border-[#101314] disabled:opacity-40" {...props}>{children}</button>;
}
