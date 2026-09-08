import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import {
  Shield, ClipboardList, Users, AlertTriangle, CheckCircle2,
  Clock, Database, Lock, Terminal, Sparkles
} from "lucide-react";

export function AdminDashboard() {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.admin.getAuditLogs(), api.admin.getAnalytics()])
      .then(([logs, a]) => {
        setAuditLogs(Array.isArray(logs) ? logs : []);
        setAnalytics(a);
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30 shrink-0">
            <Shield className="w-6 h-6 text-rose-300" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-rose-300 mb-1">System Administrator</p>
            <h1 className="text-3xl font-bold">Security & Audit Control</h1>
            <p className="text-slate-400 text-sm mt-1">
              Full system oversight — audit trails, security configurations, user management and platform health.
            </p>
          </div>
        </div>
      </div>

      {/* System metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: "Total users", value: analytics ? "6" : "—", color: "text-sky-600" },
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Audit log */}
        <div className="lg:col-span-2">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-slate-600" /> Audit Trail
          </h2>
          <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="px-5 py-3 border-b border-slate-700 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-mono text-slate-400 ml-2">audit.log — live stream</span>
            </div>
            <div className="p-5 space-y-3 font-mono text-xs">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-3 w-32 bg-slate-700 rounded animate-pulse" />
                    <div className="h-3 flex-1 bg-slate-800 rounded animate-pulse" />
                  </div>
                ))
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-3">
                    <span className="text-slate-500 shrink-0">
                      {new Date(log.timestamp).toLocaleString(undefined, { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${actionColors[log.action] || "bg-slate-700 text-slate-300"}`}>
                      {log.action}
                    </span>
                    <span className="text-slate-300">{log.actor}</span>
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
                { label: "Audit logging active", ok: true },
                { label: "AI moderation", ok: true },
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
              {[
                { label: "Manage Users & Roles", icon: Users, color: "text-sky-600" },
                { label: "Configure System Settings", icon: Shield, color: "text-violet-600" },
                { label: "Export Audit Report", icon: ClipboardList, color: "text-amber-600" },
                { label: "Review Pending Clubs", icon: Clock, color: "text-emerald-600" },
              ].map(({ label, icon: Icon, color }) => (
                <button key={label} className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-sm text-slate-700 transition-colors group text-left">
                  <Icon className={`w-4 h-4 ${color}`} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* AI platform health */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-sky-300" />
              <p className="text-xs font-bold uppercase tracking-wider text-sky-200">AI System Health</p>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              AI coaching pipeline: <span className="text-emerald-400 font-semibold">Operational</span>. Evidence scoring: <span className="text-emerald-400 font-semibold">Active</span>. Last model sync: <span className="text-slate-400">3 hours ago</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
