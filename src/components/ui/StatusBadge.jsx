import { cn } from "../../lib/cn";

/**
 * One badge component maps every status vocabulary in the product
 * (club recognition, evidence review, club health, score stage) onto the
 * same three-tone system: verified/settled (emerald), needs attention
 * (amber), at risk / rejected (brick), and neutral/in-progress (navy-soft).
 * Consistency here is what makes the whole app legible at a glance instead
 * of every screen inventing its own color meaning.
 */
const TONE_BY_STATUS = {
  // clubs
  recognized: "verified",
  pending: "watch",
  suspended: "risk",
  dormant: "neutral",
  // evidence / activities
  verified: "verified",
  submitted: "neutral",
  under_review: "watch",
  rejected: "risk",
  revision_required: "watch",
  draft: "neutral",
  // club health
  healthy: "verified",
  needs_attention: "watch",
  at_risk: "risk",
  // score stage
  ai_recommended: "neutral",
  final: "verified",
  // collaboration
  confirmed: "verified",
};

const TONE_STYLES = {
  verified: "bg-verified-soft text-verified",
  watch: "bg-watch-soft text-watch",
  risk: "bg-risk-soft text-risk",
  neutral: "bg-ink/5 text-ink-500",
};

const LABELS = {
  recognized: "Recognized",
  pending: "Pending Recognition",
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
  ai_recommended: "AI Recommended",
  final: "Final",
  confirmed: "Confirmed",
};

export function StatusBadge({ status, className }) {
  const tone = TONE_BY_STATUS[status] || "neutral";
  const label = LABELS[status] || status;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium font-mono uppercase tracking-wide",
        TONE_STYLES[tone],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        verified: "bg-verified",
        watch: "bg-watch",
        risk: "bg-risk",
        neutral: "bg-ink-300",
      }[tone])} />
      {label}
    </span>
  );
}
