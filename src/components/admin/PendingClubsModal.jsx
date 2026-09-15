import React, { useState } from "react";
import { Clock, X, CheckCircle2, XCircle, Building2, Users, FileCheck, ArrowRight } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export function PendingClubsModal({ isOpen, onClose, onClubCharterApproved }) {
  const { toast } = useToast();
  const [pendingClubs, setPendingClubs] = useState([
    {
      id: "4",
      name: "Filmmakers Guild",
      category: "Arts & Culture",
      members_count: 32,
      staff_advisor_name: "Mira Patel",
      description: "A newly forming collective for student filmmakers — short films, a termly screening night, and equipment-sharing.",
      constitution_file: "filmmakers_guild_charter_draft_v2.pdf",
      submitted_at: "2026-09-01",
    },
    {
      id: "7",
      name: "FinTech & Algorithmic Trading Lab",
      category: "Technology",
      members_count: 28,
      staff_advisor_name: "Prof. Kenneth Griffin",
      description: "Quantitative financial engineering, backtesting workshops, and crypto-asset security analytics.",
      constitution_file: "fintech_society_constitution.pdf",
      submitted_at: "2026-09-07",
    },
  ]);

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAction = (clubId, action) => {
    const club = pendingClubs.find((c) => c.id === clubId);
    if (!club) return;

    setSubmitting(true);
    setTimeout(() => {
      setPendingClubs((prev) => prev.filter((c) => c.id !== clubId));
      setSubmitting(false);

      if (action === "approve") {
        toast.success(
          "Club Charter Granted!",
          `${club.name} is now officially recognized with Digital Club Passport CC-2026-${club.id}.`
        );
        if (onClubCharterApproved) onClubCharterApproved(club);
      } else {
        toast.warning(
          "Revisions Requested",
          `Constitution amendment feedback dispatched to ${club.name} organizers.`
        );
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Clock className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Review Pending Club Charters</h3>
              <p className="text-xs text-emerald-100">Institutional Charter Approvals & Digital Passport Issuance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {pendingClubs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-semibold text-slate-700">All Club Charters Reviewed!</p>
              <p className="text-xs">No newly forming societies are currently awaiting institutional approval.</p>
            </div>
          ) : (
            pendingClubs.map((club) => (
              <div
                key={club.id}
                className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-emerald-200 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{club.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {club.category} · Advisor: <strong>{club.staff_advisor_name}</strong> · {club.members_count} Founding Members
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
                    Pending Charter
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{club.description}</p>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 font-mono">
                  <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{club.constitution_file}</span>
                  <span className="text-[10px] text-slate-400 ml-auto shrink-0">Submitted {club.submitted_at}</span>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleAction(club.id, "reject")}
                    disabled={submitting}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Request Revisions</span>
                  </button>
                  <button
                    onClick={() => handleAction(club.id, "approve")}
                    disabled={submitting}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Grant Recognition Stamp</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
