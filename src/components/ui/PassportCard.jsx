import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";
import { StatusBadge } from "./StatusBadge";

const TONES = [
  "from-[#6fafdf] to-[#2f6f9e]",
  "from-[#e0a06a] to-[#c46a3a]",
  "from-[#7dcaa8] to-[#2f8a68]",
  "from-[#b7a4ef] to-[#6a56c8]",
  "from-[#f0a0b0] to-[#c45d74]",
  "from-[#8eb6d4] to-[#3e6484]",
];

function officersOf(club) {
  return club.officers || club.public_contact_channels?.officers || [];
}

function toneOf(name = "") {
  let hash = 0;
  for (const char of name) hash = (hash + char.charCodeAt(0)) % TONES.length;
  return TONES[hash];
}

export function PassportCard({ club, className }) {
  const officers = officersOf(club);
  const president = officers.find((o) => o.title === "President") || officers[0];
  const faces = officers.slice(0, 3);

  return (
    <Link
      to={`/clubs/${club.id}`}
      className={cn(
        "group flex gap-3 rounded-[22px] border border-[#E7EAF1] bg-white p-3 shadow-[0_16px_40px_-28px_rgba(16,19,20,0.4)] transition duration-300 hover:-translate-y-1 hover:border-[#c5dff6] hover:shadow-[0_22px_40px_-22px_rgba(59,155,232,0.65)] sm:gap-4 sm:p-3.5",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#3b9be8]",
        className
      )}
    >
      <div className={cn("relative h-[108px] w-[118px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br transition duration-500 group-hover:scale-[1.03] sm:h-[120px] sm:w-[148px]", toneOf(club.name))}>
        <div className="absolute -bottom-8 left-1/2 h-24 w-28 -translate-x-1/2 rounded-[50%] bg-white/20" />
        <div className="absolute bottom-8 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white/90 text-sm font-semibold text-[#101314] transition group-hover:scale-110">
          {club.logo_initial || club.name.charAt(0)}
        </div>
        <span className="absolute bottom-2 left-3 right-3 truncate text-[11px] font-semibold text-white">
          {president?.name || club.category || "Club"}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
        <p className="text-[11px] font-semibold text-[#5F92B2]">{club.category || "Club"}</p>
        <h3 className="mt-0.5 truncate text-[15px] font-semibold tracking-tight text-[#101314] group-hover:text-[#3b9be8]">
          {club.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5E6E81] sm:text-[13px]">{club.description}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {faces.length > 0 && (
              <span className="flex -space-x-1.5">
                {faces.map((officer) => (
                  <span
                    key={officer.name}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#D7E3F2] text-[10px] font-semibold text-[#243044] transition group-hover:-translate-y-0.5"
                    title={officer.name}
                  >
                    {(officer.name || "?").charAt(0)}
                  </span>
                ))}
              </span>
            )}
            <StatusBadge status={club.status} />
          </div>
          <span className="rounded-lg bg-[#3b9be8] px-3 py-1.5 text-[11px] font-semibold text-white transition group-hover:translate-x-0.5 group-hover:bg-[#2b8ad4]">
            Open
          </span>
        </div>
      </div>
    </Link>
  );
}
