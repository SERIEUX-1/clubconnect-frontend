import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";
import { StatusBadge } from "./StatusBadge";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

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
        "group relative block overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xs",
        "transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-sky-300 hover:ring-1 hover:ring-sky-200",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500",
        className
      )}
    >
      {club.status === "recognized" && (
        <div
          className={cn(
            "pointer-events-none absolute right-4 top-4 z-10 select-none",
            "rotate-[8deg] rounded-md border-2 border-amber-600/80 bg-amber-50/90 px-2 py-0.5",
            "font-mono text-[10px] font-bold uppercase tracking-widest text-amber-900",
            "shadow-xs opacity-95 flex items-center gap-1"
          )}
        >
          <ShieldCheck className="w-3 h-3 text-amber-700" /> Verified
        </div>
      )}

      {/* Identity block */}
      <div className="flex items-center gap-4 px-5 pb-5 pt-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 font-display text-lg font-bold text-white shadow-md group-hover:scale-105 transition-transform">
          {club.logo_initial || club.name.charAt(0)}
        </div>
        <div className="min-w-0 pr-16">
          <h3 className="truncate font-display text-base font-bold leading-tight text-slate-900 group-hover:text-sky-700 transition-colors">
            {club.name}
          </h3>
          <p className="text-xs uppercase tracking-wide text-slate-400 font-medium mt-0.5">{club.category}</p>
        </div>
      </div>

      {/* Perforated tear-line */}
      <div className="tear-line mx-5" />

      {/* Detail block */}
      <div className="space-y-3 px-5 py-4">
        <p className="line-clamp-2 text-sm text-slate-600 leading-relaxed">{club.description}</p>
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="font-mono text-[11px] font-medium tracking-wider text-slate-400">
            {passportNumber}
          </span>
          <div className="flex items-center gap-2">
            <StatusBadge status={club.status} />
            <span className="text-[11px] font-semibold text-sky-600 opacity-0 group-hover:opacity-100 flex items-center transition-all translate-x-1 group-hover:translate-x-0">
              View <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
