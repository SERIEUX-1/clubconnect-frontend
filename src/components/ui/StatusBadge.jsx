import React from "react";
import { cn } from "../../lib/cn";

const TONE_BY_STATUS = {
  // clubs
  recognized: "verified",
  pending: "watch",
  suspended: "risk",
  dormant: "neutral",
  // evidence / activities
  verified: "verified",
  submitted: "sky",
  under_review: "watch",
  rejected: "risk",
  revision_required: "watch",
  draft: "neutral",
  // club health
  healthy: "verified",
  needs_attention: "watch",
  at_risk: "risk",
  // score stage
  ai_recommended: "sky",
  final: "verified",
  // collaboration
  confirmed: "verified",
  // membership
  approved: "verified",
  requested: "watch",
};

const TONE_STYLES = {
  verified: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  watch: "bg-amber-50 text-amber-700 border-amber-200/80",
  risk: "bg-rose-50 text-rose-700 border-rose-200/80",
  sky: "bg-sky-50 text-sky-700 border-sky-200/80",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
};

const DOT_STYLES = {
  verified: "bg-emerald-500",
  watch: "bg-amber-500",
  risk: "bg-rose-500",
  sky: "bg-sky-500",
  neutral: "bg-slate-400",
};

const LABELS = {
  recognized: "Recognized",
  pending: "Pending",
  suspended: "Suspended",
  dormant: "Dormant",
  verified: "Verified",
  submitted: "Submitted",
  under_review: "Under Review",
  rejected: "Rejected",
  revision_required: "Revision Required",
  draft: "Draft",
  healthy: "Healthy",
  needs_attention: "Needs Attention",
  at_risk: "At Risk",
  ai_recommended: "Copilot recommended",
  final: "Authorized Final",
  confirmed: "Confirmed",
  approved: "Approved",
  requested: "Requested",
};

export function StatusBadge({ status, className }) {
  const tone = TONE_BY_STATUS[status] || "neutral";
  const label = LABELS[status] || status;

  return (
    <span
      className={cn(
        "inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors",
        TONE_STYLES[tone],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", DOT_STYLES[tone])} />
      <span>{label}</span>
    </span>
  );
}
