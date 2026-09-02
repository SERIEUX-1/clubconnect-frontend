import { cn } from "../../lib/cn";

export function StatCard({ label, value, sublabel, tone = "default", className }) {
  return (
    <div className={cn("rounded-card bg-fog-card p-5 shadow-card", className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-300">{label}</p>
      <p
        className={cn(
          "mt-2 font-display text-3xl font-semibold",
          tone === "brass" ? "text-brass-dark" : "text-ink"
        )}
      >
        {value}
      </p>
      {sublabel && <p className="mt-1 text-sm text-ink-500">{sublabel}</p>}
    </div>
  );
}
