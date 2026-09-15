import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../lib/api";
import {
  FileText, Upload, Users, CalendarPlus, Handshake, Sparkles,
  CheckCircle2, Clock, ArrowRight, QrCode, BarChart3, PlusCircle, Copy
} from "lucide-react";
import { SubmitReportModal } from "../components/leader/SubmitReportModal";
import { ScheduleEventModal } from "../components/leader/ScheduleEventModal";
import { UploadEvidenceModal } from "../components/leader/UploadEvidenceModal";
import { ProposeCollabModal } from "../components/leader/ProposeCollabModal";

function ActionCard({ icon: Icon, label, desc, color = "sky", onClick }) {
  const colors = {
    sky: "from-sky-500 to-blue-600 shadow-sky-500/25",
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

  const clubId = user?.club_id || "1";

  useEffect(() => {
    Promise.all([
      api.activities.list(`?club=${clubId}`),
      api.events.list(),
      api.collaborations.list(),
      api.aiCoach.getFeedback(clubId),
    ])
      .then(([a, e, c, ai]) => {
        setActivities(Array.isArray(a) ? a.slice(0, 5) : []);
        setEvents(Array.isArray(e) ? e.filter((ev) => ev.club_id === clubId).slice(0, 4) : []);
        setCollaborations(Array.isArray(c) ? c.slice(0, 3) : []);
        setAiTip(ai?.feedback || "");
      })
      .finally(() => setLoading(false));
  }, [clubId]);

  const verifiedCount = activities.filter((a) => a.status === "verified").length;
  const submittedCount = activities.filter((a) => a.status === "submitted").length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="mb-8 rounded-3xl overflow-hidden relative bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-8 text-white shadow-lg shadow-sky-500/20">
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-200 mb-1">Club Leader Dashboard</p>
          <h1 className="text-3xl font-bold mb-1">
            {user?.full_name?.split(" ")[0]}'s Command Panel
          </h1>
          <p className="text-sky-100 text-sm">
            Submit reports, manage events & QR tokens, upload evidence, and track your club's CCEA standing.
          </p>
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                label="Upload Evidence"
                desc="Photos, PDFs, certificates"
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
          {/* AI Coach */}
          <div className="bg-gradient-to-br from-sky-600 to-blue-700 rounded-2xl p-5 text-white shadow-md shadow-sky-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-sky-200 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-sky-100">AI Club Coach</p>
            </div>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="h-3 bg-white/20 rounded animate-pulse" />)}
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-sky-50">{aiTip}</p>
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
        clubName={user?.club_name || "Robotics & AI Society"}
        onSubmitSuccess={(newAct) => {
          setActivities((prev) => [newAct, ...prev]);
        }}
      />

      <ScheduleEventModal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        clubId={clubId}
        clubName={user?.club_name || "Robotics & AI Society"}
        onEventCreated={(newEvt) => {
          setEvents((prev) => [newEvt, ...prev]);
        }}
      />

      <UploadEvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        clubId={clubId}
        clubName={user?.club_name || "Robotics & AI Society"}
        activities={activities}
      />

      <ProposeCollabModal
        isOpen={collabModalOpen}
        onClose={() => setCollabModalOpen(false)}
        currentClubId={clubId}
        currentClubName={user?.club_name || "Robotics & AI Society"}
        onCollabProposed={(newCollab) => {
          setCollaborations((prev) => [newCollab, ...prev]);
        }}
      />
    </div>
  );
}
