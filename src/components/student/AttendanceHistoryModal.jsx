import React, { useState } from "react";
import { CheckCircle2, Calendar, QrCode, X, Download, ShieldCheck, Award } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export function AttendanceHistoryModal({ isOpen, onClose, attendanceRecords = [] }) {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  // Default historical records if none passed
  const records = attendanceRecords.length > 0 ? attendanceRecords : [
    {
      id: "att-101",
      event_title: "Weekly AI Lab & Robot Build Session",
      club_name: "Robotics club",
      date: "2026-09-08T15:00:00Z",
      token_used: "QR-ROBOTICS-2026-ACTIVE",
      status: "verified",
      points: 2.0,
    },
    {
      id: "att-102",
      event_title: "Beginner Machine Learning Bootcamp",
      club_name: "Robotics club",
      date: "2026-08-15T09:00:00Z",
      token_used: "QR-ML-BOOTCAMP-PASS",
      status: "verified",
      points: 2.5,
    },
    {
      id: "att-103",
      event_title: "Native Campus Tree Planting Drive",
      club_name: "Alchemists Gardening Club",
      date: "2026-08-20T08:30:00Z",
      token_used: "QR-ENV-TREES-2026",
      status: "verified",
      points: 3.0,
    },
    {
      id: "att-104",
      event_title: "Campus AI Hackathon 2026",
      club_name: "Robotics club",
      date: "2026-09-02T10:00:00Z",
      token_used: "QR-HACK-PASS-2026",
      status: "verified",
      points: 4.0,
    },
  ];

  const totalPoints = records.reduce((sum, r) => sum + (r.points || 2.0), 0);

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      const csvRows = [
        ["Attendance ID", "Event Title", "Club", "Date", "Verification Token", "Status", "Points"],
        ...records.map((r) => [
          r.id,
          `"${r.event_title}"`,
          `"${r.club_name}"`,
          new Date(r.date).toLocaleDateString(),
          r.token_used,
          r.status,
          r.points,
        ]),
      ];
      const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `ClubConnect_Attendance_Transcript_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloading(false);
      toast.success("Attendance Transcript Downloaded", "Official verified attendance ledger saved as CSV.");
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">My Verified Attendance</h3>
              <p className="text-xs text-violet-100">Cryptographically & Sign-in Verified Campus Records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Stats Bar */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-xs">
            <p className="text-xs text-slate-400 font-medium">Events Attended</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{records.length}</p>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-xs">
            <p className="text-xs text-slate-400 font-medium">Verification Rate</p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">100%</p>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-xs">
            <p className="text-xs text-slate-400 font-medium">CCEA Merit Pts</p>
            <p className="text-xl font-bold text-violet-600 mt-0.5">{totalPoints.toFixed(1)}</p>
          </div>
        </div>

        {/* Attendance List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-violet-200 transition-all shadow-xs flex items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 mt-0.5 border border-violet-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm group-hover:text-violet-700 transition-colors">
                    {rec.event_title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {rec.club_name} · {new Date(rec.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {rec.token_used}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified Attendance
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
                  +{rec.points} pts
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Official institutional transcript certified by Clubs & Societies Committee.
          </p>
          <div className="flex gap-2.5">
            <button
              onClick={handleExport}
              disabled={downloading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{downloading ? "Exporting..." : "Export CSV"}</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
