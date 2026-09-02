import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";
import { StatusBadge } from "./StatusBadge";

/**
 * The signature element (per the design plan): a club rendered as an ID
 * passport page rather than a generic dashboard card. Three deliberate
 * choices tie this back to the brief instead of decorating for its own
 * sake:
 *  - the perforated tear-line separates "identity" (logo, name, category)
 *    from "detail" (description, code) exactly the way a real ID booklet
 *    stub separates a photo page from its counterfoil
 *  - the rotated brass stamp only appears when status === "recognized" —
 *    it's doing real work (signaling verification), not just decoration
 *  - the monospace passport number gives every club a document-style
 *    identity, echoing PRS §6's "Digital Club Passport" language directly
 */
export function PassportCard({ club, className }) {
  const passportNumber = `CC-${new Date(club.established_date || Date.now()).getFullYear()}-${String(
    club.code || club.id
  ).slice(0, 3).toUpperCase()}`;

  return (
    <Link
      to={`/clubs/${club.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-card bg-fog-card shadow-card",
        "transition-transform duration-200 hover:-translate-y-1",
        className
      )}
    >
      {club.status === "recognized" && (
        <div
          className={cn(
            "pointer-events-none absolute right-4 top-4 z-10 select-none",
            "rotate-[10deg] rounded-md border-2 border-brass px-2.5 py-1",
            "font-mono text-[10px] font-semibold uppercase tracking-widest text-brass-dark",
            "shadow-stamp opacity-90"
          )}
        >
          Verified
        </div>
      )}

      {/* Identity block */}
      <div className="flex items-center gap-4 px-5 pb-5 pt-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-display text-lg text-fog">
          {club.logo_initial || club.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold leading-tight text-ink">
            {club.name}
          </h3>
          <p className="text-xs uppercase tracking-wide text-ink-300">{club.category}</p>
        </div>
      </div>

      {/* Perforated tear-line */}
      <div className="tear-line mx-5" />

      {/* Detail block */}
      <div className="space-y-3 px-5 py-4">
        <p className="line-clamp-2 text-sm text-ink-500">{club.description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[11px] tracking-widest text-ink-300">
            {passportNumber}
          </span>
          <StatusBadge status={club.status} />
        </div>
      </div>
    </Link>
  );
}
