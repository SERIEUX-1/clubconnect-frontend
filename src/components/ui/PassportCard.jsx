import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";
import { StatusBadge } from "./StatusBadge";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

function officersOf(club) {
  return club.officers || club.public_contact_channels?.officers || [];
}

export function PassportCard({ club, className }) {
  const passportNumber = `CC-${new Date(club.established_date || Date.now()).getFullYear()}-${String(
    club.code || club.id
  ).slice(0, 3).toUpperCase()}`;
  const officers = officersOf(club);
  const president = officers.find((o) => o.title === "President") || officers[0];
  const cycle = club.recognition_cycle || club.public_contact_channels?.cycle;

  return (
    <Link
      to={`/clubs/${club.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-[26px] border border-white/80 bg-[rgba(255,252,247,0.82)] shadow-card backdrop-blur-md",
        "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-island",
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

      <div className="flex items-center gap-4 px-5 pb-5 pt-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-amber-400 font-display text-lg font-bold text-white shadow-md transition-transform group-hover:scale-105">
          {club.logo_initial || club.name.charAt(0)}
        </div>
        <div className="min-w-0 pr-16">
          <h3 className="truncate font-display text-lg font-medium leading-tight text-[#1e3a5f] group-hover:text-[#3a7cae] transition-colors">
            {club.name}
          </h3>
          <p className="text-xs uppercase tracking-wide text-slate-400 font-medium mt-0.5">{club.category}</p>
        </div>
      </div>

      <div className="tear-line mx-5" />

      <div className="space-y-3 px-5 py-4">
        <p className="line-clamp-2 text-sm text-slate-600 leading-relaxed">{club.description}</p>
        {president?.name && (
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-600">{president.title || "President"}</span>
            {" · "}
            {president.name}
          </p>
        )}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="font-mono text-[11px] font-medium tracking-wider text-slate-400">
            {cycle || passportNumber}
          </span>
          <div className="flex items-center gap-2">
            {club.published_watch_count > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                {club.published_watch_count} to watch
              </span>
            )}
            <StatusBadge status={club.status} />
            <span className="text-[11px] font-semibold text-sky-600 opacity-0 group-hover:opacity-100 flex items-center transition-all translate-x-1 group-hover:translate-x-0">
              Watch work <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
