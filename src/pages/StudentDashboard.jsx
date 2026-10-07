import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import {
  CalendarDays, Users, QrCode, CheckCircle2, Clock, Star, Sparkles,
  ArrowRight, BookOpen, Award
} from "lucide-react";
import { QRCheckInModal } from "../components/student/QRCheckInModal";
import { AttendanceHistoryModal } from "../components/student/AttendanceHistoryModal";
import { RequestCharterModal } from "../components/student/RequestCharterModal";
import { DeclareClubsModal } from "../components/student/DeclareClubsModal";
import { useMembershipWindow } from "../hooks/useMembershipWindow";

function StatCard({ icon: Icon, label, value, color = "sky" }) {
  const colors = {
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [events, setEvents] = useState([]);
  const [aiTip, setAiTip] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal states
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [charterOpen, setCharterOpen] = useState(false);
  const [declareOpen, setDeclareOpen] = useState(false);
  const { open: censusOpen, loading: censusLoading } = useMembershipWindow();

  useEffect(() => {
    const onCopilot = (event) => {
      const action = event.detail?.action;
      if (action === "open_qr_checkin") setQrModalOpen(true);
      if (action === "open_attendance_history") setAttendanceModalOpen(true);
      if (action === "open_request_charter") setCharterOpen(true);
    };
    window.addEventListener("cc-copilot-action", onCopilot);
    return () => window.removeEventListener("cc-copilot-action", onCopilot);
  }, []);

  useEffect(() => {
    Promise.all([api.memberships.list(), api.events.list(), api.copilot.brief()])
      .then(([m, e, ai]) => {
        setMemberships(Array.isArray(m) ? m : []);
        setEvents(Array.isArray(e) ? e : []);
        setAiTip(ai?.feedback || "");
      })
      .finally(() => setLoading(false));
  }, [user?.email]);

  const approvedMemberships = memberships.filter((m) => m.status === "approved");
  const pendingMemberships = memberships.filter((m) => m.status === "requested");
  const activeEvents = events.filter((e) => e.check_in_open);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero greeting */}
      <div className="morning-hero mb-8 rounded-[28px] p-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5F92B2]">Student Dashboard</p>
        <h1 className="mb-1 text-4xl font-semibold tracking-tight text-[#101314]">
          Welcome back, {user?.full_name?.split(" ")[0] || "Student"}
        </h1>
        <p className="text-slate-500 text-sm">
          {user?.institution?.academic_year
            ? `${user.institution.short_name || "Campus"} · ${user.institution.academic_year}`
            : "Your clubs, check-ins, and a portable leadership record."}
        </p>
        <button
          type="button"
          onClick={async () => {
            try {
              const pack = await api.auth.transcript();
              const blob = new Blob([pack.text || ""], { type: "text/plain;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `ClubConnect_Transcript_${pack.academic_year || "record"}.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            } catch {
              /* api.js already warns */
            }
          }}
          className="mt-4 inline-flex items-center rounded-full border border-sky-200 bg-white px-4 py-2 text-xs font-semibold text-sky-800"
        >
          Download leadership transcript
        </button>
        <button
          type="button"
          onClick={() => setCharterOpen(true)}
          className="sun-cta mt-4 ml-2 rounded-full px-4 py-2 text-xs font-semibold text-white"
        >
          Request club registration
        </button>
        <button
          type="button"
          onClick={() => setDeclareOpen(true)}
          disabled={!censusOpen}
          className={`mt-4 ml-2 rounded-full px-4 py-2 text-xs font-semibold ${
            censusOpen ? "border border-sky-200 bg-white text-sky-800" : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
          }`}
        >
          {censusOpen ? "Send the clubs I belong to" : censusLoading ? "Checking membership window…" : "Membership requests are closed"}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Active memberships" value={loading ? "—" : approvedMemberships.length} color="sky" />
        <StatCard icon={Clock} label="Pending requests" value={loading ? "—" : pendingMemberships.length} color="amber" />
        <StatCard icon={QrCode} label="Live check-ins" value={loading ? "—" : activeEvents.length} color="emerald" />
        <StatCard icon={CalendarDays} label="Upcoming events" value={loading ? "—" : events.length} color="violet" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Clubs */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-500" /> My Club Memberships
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 h-20 animate-pulse" />
              ))}
            </div>
          ) : memberships.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-sky-200 p-8 text-center">
              <Users className="w-8 h-8 text-sky-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-700">No club memberships yet</p>
              <p className="text-sm text-slate-400 mt-1">Explore clubs and send a join request to get started.</p>
              <Link
                to="/clubs"
                className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-sky-500 text-white text-xs font-semibold rounded-full hover:bg-sky-600 transition-colors"
              >
                Discover Clubs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {memberships.map((m, i) => (
                <Link
                  key={m.id || i}
                  to={m.club ? `/clubs/${m.club}` : "/clubs"}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center justify-between group hover:border-sky-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-amber-400 text-sm font-bold text-white">
                      {m.club_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{m.club_name}</p>
                      <p className="text-xs text-slate-400 capitalize">
                        {m.role} · Open published activities & films
                      </p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    m.status === "approved"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {m.status === "approved" ? "Watch page" : "Pending"}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Upcoming Events */}
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mt-8">
            <CalendarDays className="w-4 h-4 text-sky-500" /> Upcoming Events
          </h2>
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-100 h-24 animate-pulse" />
          ) : events.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">No upcoming events.</p>
          ) : (
            <div className="space-y-3">
              {events.map((evt) => (
                <div key={evt.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{evt.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{evt.location} · {evt.club_name}</p>
                    </div>
                    {evt.check_in_open ? (
                      <button
                        onClick={() => {
                          setSelectedEventId(evt.id);
                          setQrModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 text-white text-[11px] font-bold rounded-full hover:bg-emerald-600 active:scale-95 transition-all shadow-xs shrink-0"
                      >
                        <QrCode className="w-3.5 h-3.5" /> Check In
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full shrink-0">
                        {evt.check_in_window}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-sky-600 font-medium mt-2">
                    {new Date(evt.starts_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Copilot campus guide */}
          <div className="cc-dusk rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-sky-200" />
              <p className="text-xs font-bold uppercase tracking-wider text-sky-100">ClubConnect Copilot</p>
            </div>
            {loading ? (
              <div className="space-y-2">
                <div className="h-3 bg-white/20 rounded animate-pulse" />
                <div className="h-3 bg-white/20 rounded animate-pulse w-4/5" />
                <div className="h-3 bg-white/20 rounded animate-pulse w-3/5" />
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-sky-50">{aiTip || "Copilot will explain what you can do after it loads your role at this institution."}</p>
            )}
          </div>

          {/* Hall of Excellence teaser */}
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Campus Awards</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Winners appear here after the Committee Head publishes the Campus Clubs Excellence Awards. Until then, marks stay confidential.
            </p>
            <Link
              to="/hall-of-excellence"
              className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              Open the Hall of Excellence <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick discover */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Quick Actions</p>
            <div className="space-y-2">
              <Link to="/" className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-sky-50 text-sm text-slate-700 hover:text-sky-700 transition-colors group">
                <Users className="w-4 h-4 text-sky-500" />
                <span>Discover & Join Clubs</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-300 group-hover:text-sky-500" />
              </Link>
              <button
                onClick={() => {
                  setSelectedEventId(activeEvents[0]?.id || events[0]?.id || "evt-1");
                  setQrModalOpen(true);
                }}
                className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-emerald-50 text-sm text-slate-700 hover:text-emerald-700 transition-colors group active:scale-[0.98]"
              >
                <QrCode className="w-4 h-4 text-emerald-500" />
                <span>Scan QR Check-In</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-300 group-hover:text-emerald-500" />
              </button>
              <button
                onClick={() => setAttendanceModalOpen(true)}
                className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-violet-50 text-sm text-slate-700 hover:text-violet-700 transition-colors group active:scale-[0.98]"
              >
                <CheckCircle2 className="w-4 h-4 text-violet-500" />
                <span>View My Attendance</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-300 group-hover:text-violet-500" />
              </button>
              <Link
                to="/hall-of-excellence"
                className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-amber-50 text-sm text-slate-700 hover:text-amber-700 transition-colors group"
              >
                <Star className="w-4 h-4 text-amber-500" />
                <span>Hall of Excellence</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-300 group-hover:text-amber-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <QRCheckInModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        events={events}
        defaultEventId={selectedEventId}
        onCheckInSuccess={({ eventId, eventTitle, record }) => {
          setAttendanceRecords((prev) => [
            {
              id: record.id || `att-${Date.now()}`,
              event_title: eventTitle || "Campus Event",
              club_name: "Campus Club",
              date: new Date().toISOString(),
              token_used: record.detail || "VERIFIED-PRESENCE",
              status: "verified",
              points: 2.0,
            },
            ...prev,
          ]);
        }}
      />

      <AttendanceHistoryModal
        isOpen={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        attendanceRecords={attendanceRecords}
      />

      <RequestCharterModal isOpen={charterOpen} onClose={() => setCharterOpen(false)} />
      <DeclareClubsModal
        isOpen={declareOpen}
        onClose={() => setDeclareOpen(false)}
        onSubmitted={() => api.memberships.list().then((m) => setMemberships(Array.isArray(m) ? m : []))}
      />
    </div>
  );
}
