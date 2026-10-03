import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../lib/api";
import {
  FileText, Upload, Users, CalendarPlus,   Handshake, Sparkles,
  CheckCircle2, Clock, ArrowRight, QrCode, BarChart3, PlusCircle, Copy, PlayCircle, Repeat
} from "lucide-react";
import { SubmitReportModal } from "../components/leader/SubmitReportModal";
import { ScheduleEventModal } from "../components/leader/ScheduleEventModal";
import { UploadEvidenceModal } from "../components/leader/UploadEvidenceModal";
import { PublishWatchModal } from "../components/leader/PublishWatchModal";
import { ProposeCollabModal } from "../components/leader/ProposeCollabModal";
import { HandoverModal } from "../components/leader/HandoverModal";
import { ConceptNoteModal } from "../components/leader/ConceptNoteModal";
import { DeclareClubsModal } from "../components/student/DeclareClubsModal";
import { useMembershipWindow } from "../hooks/useMembershipWindow";

function ActionCard({ icon: Icon, label, desc, color = "sky", onClick }) {
  const colors = {
    sky: "from-sky-500 to-amber-400 shadow-sky-500/25",
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/25",
    violet: "from-violet-500 to-purple-600 shadow-violet-500/25",
    amber: "from-amber-500 to-orange-500 shadow-amber-500/25",
  };
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-left hover:shadow-md hover:border-sky-200 active:scale-[0.98] transition-all group w-full"
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${colors[color]} text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-semibold text-slate-900 text-sm">{label}</p>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
    </button>
  );
}

export function LeaderDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState([]);
  const [events, setEvents] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [aiTip, setAiTip] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal open states
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [handoverModalOpen, setHandoverModalOpen] = useState(false);
  const [conceptNoteOpen, setConceptNoteOpen] = useState(false);
  const [declareOpen, setDeclareOpen] = useState(false);
  const { open: censusOpen, loading: censusLoading } = useMembershipWindow();
  const [joinRequests, setJoinRequests] = useState([]);
  const [committeeRoster, setCommitteeRoster] = useState([]);
  const [clubBudget, setClubBudget] = useState(null);

  const clubId = user?.led_clubs?.[0] || user?.club_id || user?.assigned_clubs?.[0];

  useEffect(() => {
    const onCopilot = (event) => {
      const action = event.detail?.action;
      if (action === "open_submit_report") setReportModalOpen(true);
      if (action === "open_schedule_event") setEventModalOpen(true);
      if (action === "open_upload_evidence") setEvidenceModalOpen(true);
      if (action === "open_publish_watch") setPublishModalOpen(true);
      if (action === "open_propose_collab") setCollabModalOpen(true);
    };
    window.addEventListener("cc-copilot-action", onCopilot);
    return () => window.removeEventListener("cc-copilot-action", onCopilot);
  }, []);

  useEffect(() => {
    Promise.all([
      api.activities.list(`?club=${clubId}`),
      api.events.list(),
      api.collaborations.list(),
      api.copilot.brief(clubId),
      api.memberships.list(),
      api.memberships.myBudget().catch(() => null),
    ])
      .then(([a, e, c, ai, members, budget]) => {
        setActivities(Array.isArray(a) ? a.slice(0, 5) : []);
        setEvents(Array.isArray(e) ? e.filter((ev) => ev.club_id === clubId).slice(0, 4) : []);
        setCollaborations(Array.isArray(c) ? c.slice(0, 3) : []);
        setAiTip(ai?.feedback || "");
        setJoinRequests(Array.isArray(members) ? members.filter((m) => m.status === "requested") : []);
        setCommitteeRoster(
          Array.isArray(members)
            ? members.filter(
                (m) =>
                  String(m.club) === String(clubId) &&
                  (m.role === "leader" || m.role === "officer") &&
                  m.status === "approved"
              )
            : []
        );
        setClubBudget(budget);
      })
      .finally(() => setLoading(false));
  }, [clubId]);

  const verifiedCount = activities.filter((a) => a.status === "verified").length;
  const submittedCount = activities.filter((a) => a.status === "submitted").length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="cc-dusk relative mb-8 overflow-hidden rounded-3xl p-8 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-200 mb-1">Club Leader Dashboard</p>
          <h1 className="text-3xl font-bold mb-1">
            {user?.full_name?.split(" ")[0]}'s Command Panel
          </h1>
          <p className="text-sky-100 text-sm">
            Submit reports, publish films for the campus to watch, manage events, and track CCEA standing.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPublishModalOpen(true)}
              className="inline-flex rounded-full bg-amber-400 px-4 py-2 text-xs font-bold text-slate-900 hover:bg-amber-300"
            >
              Publish videos & photos
            </button>
            {clubId && (
              <Link
                to={`/clubs/${clubId}`}
                className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white hover:bg-white/25"
              >
                Open the campus club page
              </Link>
            )}
            <button
              type="button"
              onClick={() => setDeclareOpen(true)}
              disabled={!censusOpen}
              className={`inline-flex rounded-full px-4 py-2 text-xs font-bold ${
                censusOpen
                  ? "bg-white text-slate-900 hover:bg-sky-50"
                  : "cursor-not-allowed bg-white/10 text-white/60"
              }`}
            >
              {censusOpen
                ? "Send clubs I belong to"
                : censusLoading
                  ? "Checking membership window…"
                  : "Membership requests closed"}
            </button>
          </div>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Activities logged", value: loading ? "—" : activities.length, icon: BarChart3, c: "sky" },
          { label: "Verified", value: loading ? "—" : verifiedCount, icon: CheckCircle2, c: "emerald" },
          { label: "Pending review", value: loading ? "—" : submittedCount, icon: Clock, c: "amber" },
          { label: "Collaborations", value: loading ? "—" : collaborations.length, icon: Handshake, c: "violet" },
        ].map(({ label, value, icon: Icon, c }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick actions */}
          <div>
            <h2 className="font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <ActionCard
                icon={PlayCircle}
                label="Publish to campus"
                desc="Videos & photos on your club page"
                color="sky"
                onClick={() => setPublishModalOpen(true)}
              />
              <ActionCard
                icon={FileText}
                label="Submit Report"
                desc="Monthly activity & narrative report"
                color="sky"
                onClick={() => setReportModalOpen(true)}
              />
              <ActionCard
                icon={CalendarPlus}
                label="Schedule Event"
                desc="Create event & generate QR token"
                color="emerald"
                onClick={() => setEventModalOpen(true)}
              />
              <ActionCard
                icon={Upload}
                label="Committee evidence"
                desc="Proof for CCEA review, not the public page"
                color="violet"
                onClick={() => setEvidenceModalOpen(true)}
              />
              <ActionCard
                icon={Handshake}
                label="Propose Collab"
                desc="Initiate cross-club partnership"
                color="amber"
                onClick={() => setCollabModalOpen(true)}
              />
              <ActionCard
                icon={Repeat}
                label="Handover"
                desc="Send the full committee slate to the Committee Head"
                color="violet"
                onClick={() => setHandoverModalOpen(true)}
              />
              <ActionCard
                icon={FileText}
                label="Concept note"
                desc="Request a share of this year's membership grant"
                color="amber"
                onClick={() => setConceptNoteOpen(true)}
              />
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-500" /> Recent Activities
              </h2>
              <button
                onClick={() => setReportModalOpen(true)}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <span>+ New Report</span>
              </button>
            </div>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-100 h-16 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {activities.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">No activities logged yet. Submit your first activity report!</div>
                ) : (
                  activities.map((act, i) => (
                    <div key={act.id} className={`p-4 flex items-center justify-between gap-3 ${i !== 0 ? "border-t border-slate-50" : ""}`}>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{act.title}</p>
                        <p className="text-xs text-slate-400">{act.activity_type} · {new Date(act.date_time).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                        act.status === "verified"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {act.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Events with QR */}
          {events.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-sky-500" /> Events & QR Tokens
                </h2>
                <button
                  onClick={() => setEventModalOpen(true)}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>+ Schedule Event</span>
                </button>
              </div>
              <div className="space-y-3">
                {events.map((evt) => (
                  <div key={evt.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{evt.title}</p>
                      <p className="text-xs text-slate-400">{evt.location}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        title="Click to copy QR token"
                        onClick={() => {
                          navigator.clipboard.writeText(evt.qr_token);
                          toast.success("Copied to Clipboard", `QR Token ${evt.qr_token} ready to share.`);
                        }}
                        className="group flex items-center gap-1.5 text-[10px] font-mono bg-slate-100 hover:bg-sky-50 hover:text-sky-700 px-2.5 py-1.5 rounded-lg text-slate-600 border border-transparent hover:border-sky-200 transition-colors"
                      >
                        <span>{evt.qr_token}</span>
                        <Copy className="w-3 h-3 text-slate-400 group-hover:text-sky-600" />
                      </button>
                      {evt.check_in_open && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Check-in is currently live" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Copilot evaluation */}
          <div className="cc-dusk rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-sky-200 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-sky-100">Copilot evaluation</p>
            </div>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="h-3 bg-white/20 rounded animate-pulse" />)}
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-sky-50">{aiTip}</p>
            )}
          </div>

          {(() => {
            const mine = (clubBudget?.clubs || []).find((c) => String(c.id) === String(clubId)) || clubBudget?.clubs?.[0];
            if (!mine) return null;
            const cur = clubBudget.currency || "USD";
            return (
              <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
                <h3 className="mb-1 text-sm font-bold text-slate-800">This year&apos;s grant</h3>
                <p className="text-[11px] text-slate-500">
                  Exclusive members {mine.exclusive} · sharing {mine.in_2 + mine.in_3 + mine.in_4 + mine.in_5_plus}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {cur} {mine.remaining}
                  <span className="ml-1 text-xs font-semibold text-slate-400">left of {cur} {mine.entitlement}</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Used {mine.pct_used}% · {mine.latest_comment || "No spend recorded yet"}
                </p>
              </div>
            );
          })()}

          {/* Join requests */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-500" /> Join requests
            </h3>
            {joinRequests.length === 0 ? (
              <p className="text-xs text-slate-400">No pending membership requests.</p>
            ) : (
              <div className="space-y-2">
                {joinRequests.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{m.user_name || m.user}</p>
                      <p className="text-[11px] text-slate-400">{m.club_name}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700"
                        onClick={async () => {
                          await api.memberships.approve(m.id);
                          setJoinRequests((prev) => prev.filter((x) => x.id !== m.id));
                          toast.success("Member approved", m.user_name || "Student");
                        }}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="rounded-lg bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-700"
                        onClick={async () => {
                          await api.memberships.reject(m.id);
                          setJoinRequests((prev) => prev.filter((x) => x.id !== m.id));
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collaborations */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Handshake className="w-4 h-4 text-violet-500" /> Collaborations
            </h3>
            {loading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse" />)}
              </div>
            ) : collaborations.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">No collaborations yet. Propose a joint project to earn bonus CCEA points!</p>
            ) : (
              <div className="space-y-2">
                {collaborations.map((col) => (
                  <div key={col.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-800">{col.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{col.partner_club} · {col.status}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setCollabModalOpen(true)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-violet-200 text-xs font-semibold text-violet-600 hover:bg-violet-50 active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Propose New Collaboration
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <SubmitReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        clubId={clubId}
        clubName={user?.club_name || "Robotics club"}
        onSubmitSuccess={(newAct) => {
          setActivities((prev) => [newAct, ...prev]);
        }}
      />

      <ScheduleEventModal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        clubId={clubId}
        clubName={user?.club_name || "Robotics club"}
        onEventCreated={(newEvt) => {
          setEvents((prev) => [newEvt, ...prev]);
        }}
      />

      <UploadEvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        clubId={clubId}
        clubName={user?.club_name || "Robotics club"}
        activities={activities}
      />

      <PublishWatchModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        clubId={clubId}
        clubName={user?.club_name || "your club"}
      />

      <HandoverModal
        isOpen={handoverModalOpen}
        onClose={() => setHandoverModalOpen(false)}
        clubId={clubId}
        currentOfficers={committeeRoster}
      />
      <ConceptNoteModal
        isOpen={conceptNoteOpen}
        onClose={() => setConceptNoteOpen(false)}
        clubId={clubId}
        currency={clubBudget?.currency || "USD"}
      />
      <DeclareClubsModal isOpen={declareOpen} onClose={() => setDeclareOpen(false)} />

      <ProposeCollabModal
        isOpen={collabModalOpen}
        onClose={() => setCollabModalOpen(false)}
        currentClubId={clubId}
        currentClubName={user?.club_name || "Robotics club"}
        onCollabProposed={(newCollab) => {
          setCollaborations((prev) => [newCollab, ...prev]);
        }}
      />
    </div>
  );
}
