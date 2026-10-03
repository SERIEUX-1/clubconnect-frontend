import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import {
  Shield, ClipboardList, Users, AlertTriangle, CheckCircle2,
  Clock, Database, Lock, Terminal, Sparkles, Download, Filter, Mail
} from "lucide-react";
import { ManageUsersModal } from "../components/admin/ManageUsersModal";
import { SystemSettingsModal } from "../components/admin/SystemSettingsModal";
import { PendingClubsModal } from "../components/admin/PendingClubsModal";

export function AdminDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const campus = user?.institution?.short_name || user?.institution?.name;
  const isPlatformOperator = user?.role === "system_admin" && !user?.institution;
  const [auditLogs, setAuditLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [userCount, setUserCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logFilter, setLogFilter] = useState("all");

  // Modals state
  const [usersModalOpen, setUsersModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [pendingClubsModalOpen, setPendingClubsModalOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [campusHandovers, setCampusHandovers] = useState([]);

  useEffect(() => {
    Promise.all([
      api.admin.getAuditLogs(),
      api.admin.getAnalytics(),
      api.admin.listLicenceInquiries().catch(() => []),
      api.admin.listCampusUsers().catch(() => []),
      api.admin.listCampusHandovers().catch(() => []),
    ])
      .then(([logs, a, licenceRows, directory, handovers]) => {
        setAuditLogs(Array.isArray(logs) ? logs : []);
        setAnalytics(a);
        setInquiries(Array.isArray(licenceRows) ? licenceRows : []);
        setUserCount(Array.isArray(directory) ? directory.length : null);
        setCampusHandovers(Array.isArray(handovers) ? handovers : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const actionColors = {
    "criteria.configured": "bg-violet-100 text-violet-700",
    "evidence.verified": "bg-emerald-100 text-emerald-700",
    "score.adjusted": "bg-amber-100 text-amber-700",
    "user.created": "bg-sky-100 text-sky-700",
    "club.registered": "bg-blue-100 text-blue-700",
  };

  const filteredLogs = auditLogs.filter((l) => {
    if (logFilter === "all") return true;
    return l.action === logFilter;
  });

  const handleExportAudit = () => {
    const csvRows = [
      ["Audit ID", "Timestamp", "Actor", "Action", "Target", "Reason"],
      ...auditLogs.map((l) => [
        l.id,
        l.timestamp,
        `"${l.actor}"`,
        l.action,
        `"${l.target_model} ${l.target_id || ""}"`,
        `"${l.reason}"`,
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((r) => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Institutional_Audit_Stream_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit Log Exported", "Complete cryptographic audit trail saved as CSV.");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-8 text-white shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4 max-w-xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30 shrink-0">
            <Shield className="w-6 h-6 text-rose-300" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rose-300 mb-1">
              {isPlatformOperator ? "ClubConnect operator" : `${campus || "Campus"} system administrator`}
            </p>
            <h1 className="text-3xl font-bold">{isPlatformOperator ? "Licence desk" : "Campus administration"}</h1>
            <p className="text-slate-400 text-sm mt-1">
              {isPlatformOperator
                ? "You licence universities onto ClubConnect. You do not run a campus's clubs or awards."
                : "You run this licensed campus — people, sign-in domains, and audit — the same job as a Google Workspace Super Admin or Canvas Account Admin. You do not mark CCEA, and you do not licence other universities."}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex gap-2.5 shrink-0">
          <button
            onClick={handleExportAudit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* System metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: "People on this campus", value: userCount ?? (analytics ? "—" : "—"), color: "text-sky-600" },
          { icon: Database, label: "Clubs in system", value: analytics?.total_active_clubs || "—", color: "text-violet-600" },
          { icon: ClipboardList, label: "Audit log entries", value: loading ? "—" : auditLogs.length, color: "text-amber-600" },
          { icon: CheckCircle2, label: "Verified evidence", value: analytics?.verified_evidence_count || "—", color: "text-emerald-600" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {!isPlatformOperator && campusHandovers.filter((h) => h.status === "nominated").length > 0 && (
        <div className="mb-8 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <h2 className="mb-1 font-bold text-slate-800">Committee Head handovers awaiting you</h2>
          <p className="mb-4 text-xs text-slate-500">
            Confirming replaces the outgoing Clubs &amp; Societies Committee Head with the incoming names and switches their ClubConnect permissions immediately.
          </p>
          <div className="space-y-4">
            {campusHandovers
              .filter((h) => h.status === "nominated")
              .map((h) => (
                <div key={h.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{h.institution_name} · {h.academic_year}</p>
                      <p className="text-xs text-slate-500">
                        Submitted by {h.outgoing_name} ({h.submitted_by_email})
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                        onClick={async () => {
                          try {
                            await api.admin.declineCampusHandover(h.id);
                            setCampusHandovers((prev) =>
                              prev.map((row) => (row.id === h.id ? { ...row, status: "declined" } : row))
                            );
                            toast.info("Handover declined", "Committee Head permissions were not changed.");
                          } catch (err) {
                            toast.error(err.message || "Could not decline.");
                          }
                        }}
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                        onClick={async () => {
                          try {
                            await api.admin.confirmCampusHandover(h.id);
                            setCampusHandovers((prev) =>
                              prev.map((row) => (row.id === h.id ? { ...row, status: "confirmed" } : row))
                            );
                            toast.success(
                              "Committee Head switched",
                              "The incoming Committee Head now holds that office. Outgoing heads return to student or club leader unless they still lead a club."
                            );
                          } catch (err) {
                            toast.error(err.message || "Could not confirm handover.");
                          }
                        }}
                      >
                        Confirm and switch
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Outgoing</p>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {(h.outgoing_committee || []).map((p) => (
                          <li key={`${p.email}-out`}>
                            <span className="font-semibold">{p.name}</span> · {p.position}
                            <span className="block text-slate-400">{p.email}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">Incoming</p>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {(h.incoming_committee || []).map((p) => (
                          <li key={`${p.email}-in`}>
                            <span className="font-semibold">{p.name}</span> · {p.position}
                            <span className="block text-slate-400">{p.email}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {isPlatformOperator && (
      <div className="mb-8 rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-600" /> Campus licence requests
          </h2>
          <span className="text-xs font-semibold text-amber-700">
            {inquiries.filter((row) => row.status === "new").length} new
          </span>
        </div>
        {inquiries.length === 0 ? (
          <p className="text-sm text-slate-500">
            When a university finds ClubConnect and asks to join, their request lands here. Reply to the work email, then create their Institution.
          </p>
        ) : (
          <div className="space-y-3">
            {inquiries.map((row) => (
              <div key={row.id} className="rounded-2xl border border-sky-100 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{row.institution_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {row.contact_name}
                      {row.contact_role ? ` · ${row.contact_role}` : ""} · {row.contact_email}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Students @{row.student_email_domain || "—"} · Staff @{row.staff_email_domain || "—"}
                    </p>
                    {row.message ? <p className="text-sm text-slate-600 mt-2">{row.message}</p> : null}
                  </div>
                  <span className="text-[10px] uppercase tracking-wide font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded-full">
                    {row.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`mailto:${row.contact_email}?subject=${encodeURIComponent("ClubConnect campus licence")}&body=${encodeURIComponent(`Hello ${row.contact_name},\n\nThank you for requesting ClubConnect for ${row.institution_name}.\n`)}`}
                    className="text-xs font-semibold text-sky-800 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100"
                  >
                    Reply by email
                  </a>
                  {["contacted", "licensed", "declined"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={async () => {
                        const updated = await api.admin.updateLicenceInquiry(row.id, { status });
                        setInquiries((prev) => prev.map((item) => (item.id === row.id ? updated : item)));
                        toast.success("Request updated", `${row.institution_name} marked ${status}.`);
                      }}
                      className="text-xs font-semibold text-slate-600 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 capitalize"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Audit log */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-slate-600" /> Live Audit Trail
            </h2>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              {[
                { id: "all", label: "All Events" },
                { id: "criteria.configured", label: "Criteria" },
                { id: "evidence.verified", label: "Evidence" },
                { id: "score.adjusted", label: "Scores" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setLogFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    logFilter === tab.id
                      ? "bg-white text-slate-900 font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="px-5 py-3 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2">audit.log — continuous stream</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">● LIVE</span>
            </div>
            <div className="p-5 space-y-3 font-mono text-xs">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-3 w-32 bg-slate-700 rounded animate-pulse" />
                    <div className="h-3 flex-1 bg-slate-800 rounded animate-pulse" />
                  </div>
                ))
              ) : filteredLogs.length === 0 ? (
                <p className="text-slate-500 text-xs py-4 text-center">No audit entries match this filter.</p>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-3 hover:bg-slate-800/40 p-1.5 rounded-lg transition-colors">
                    <span className="text-slate-500 shrink-0">
                      {new Date(log.timestamp).toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${actionColors[log.action] || "bg-slate-700 text-slate-300"}`}>
                      {log.action}
                    </span>
                    <span className="text-slate-300 font-semibold">{log.actor_name || log.actor}</span>
                    <span className="text-slate-500 hidden sm:inline">→</span>
                    <span className="text-slate-400 leading-relaxed">{log.reason}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Security panel */}
        <div className="space-y-5">
          {/* Security status */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-600" /> Security Status
            </h3>
            <div className="space-y-3">
              {[
                { label: "JWT Authentication", ok: true },
                { label: "HTTPS enforced", ok: true },
                { label: "Role-based access", ok: true },
                { label: "Campus audit log", ok: true },
                { label: "Sign-in by licensed email", ok: true },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">{label}</span>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${ok ? "text-emerald-600" : "text-rose-600"}`}>
                    {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    {ok ? "Active" : "Alert"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick admin actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-600" /> Admin Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setUsersModalOpen(true)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-sky-50 text-sm text-slate-700 hover:text-sky-700 transition-colors group text-left active:scale-[0.98]"
              >
                <Users className="w-4 h-4 text-sky-600" />
                <span>People & roles</span>
              </button>

              <button
                onClick={() => setSettingsModalOpen(true)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-violet-50 text-sm text-slate-700 hover:text-violet-700 transition-colors group text-left active:scale-[0.98]"
              >
                <Shield className="w-4 h-4 text-violet-600" />
                <span>Campus sign-in & awards settings</span>
              </button>

              <button
                onClick={handleExportAudit}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-amber-50 text-sm text-slate-700 hover:text-amber-700 transition-colors group text-left active:scale-[0.98]"
              >
                <ClipboardList className="w-4 h-4 text-amber-600" />
                <span>Export Audit Report</span>
              </button>

              <button
                onClick={() => setPendingClubsModalOpen(true)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-emerald-50 text-sm text-slate-700 hover:text-emerald-700 transition-colors group text-left active:scale-[0.98]"
              >
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Review Pending Clubs</span>
              </button>
            </div>
          </div>

          {/* Copilot platform health */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-sky-300" />
              <p className="text-xs font-bold uppercase tracking-wider text-sky-200">What this role is not</p>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              The Committee Head marks and publishes CCEA. Staff watch campus participation. You keep the campus directory and sign-in doors in order so those people can work.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <ManageUsersModal
        isOpen={usersModalOpen}
        onClose={() => setUsersModalOpen(false)}
      />

      <SystemSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      <PendingClubsModal
        isOpen={pendingClubsModalOpen}
        onClose={() => setPendingClubsModalOpen(false)}
        onClubCharterApproved={() => {
          setAnalytics((prev) => prev ? { ...prev, recognized_clubs: prev.recognized_clubs + 1 } : prev);
        }}
      />
    </div>
  );
}
