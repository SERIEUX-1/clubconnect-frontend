import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Award, Trophy, Landmark, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export function HallOfExcellence() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const program = user?.institution?.awards_program_name || "Campus Clubs Excellence Awards";
  const campus = user?.institution?.short_name || "this campus";

  useEffect(() => {
    api.awards
      .getHallOfExcellence()
      .then((rows) => setEntries(Array.isArray(rows) ? rows : []))
      .finally(() => setLoading(false));
  }, []);

  const byYear = useMemo(() => {
    const groups = new Map();
    for (const row of entries) {
      const raw = String(row.year || row.academic_year || "");
      const year = (raw.match(/\d{4}/) || [raw || "Unknown year"])[0];
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year).push(row);
    }
    return [...groups.entries()].sort((a, b) => String(b[0]).localeCompare(String(a[0])));
  }, [entries]);

  return (
    <div className="min-h-screen pb-20">
      <section className="relative overflow-hidden border-b border-amber-200/40 bg-gradient-to-br from-slate-900 via-amber-950 to-sky-950 text-white">
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-14">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300">
            <Trophy className="h-4 w-4" />
            {campus} · Hall of Excellence
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-tight sm:text-5xl">
            {program}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-amber-50/85">
            Published honours from the Campus Clubs Excellence Awards. Marks and unpublished rankings stay with the Committee Head until ceremony night.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-amber-100/80">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
              <Landmark className="h-3.5 w-3.5" />
              {byYear.length || "—"} years
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
              <Award className="h-3.5 w-3.5" />
              {entries.length} recorded honours
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-3xl bg-white/70" />
            ))}
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="rounded-3xl border border-amber-100 bg-white/80 p-10 text-center shadow-sm">
            <Sparkles className="mx-auto h-8 w-8 text-amber-500" />
            <p className="mt-3 font-semibold text-slate-800">The hall is waiting for its first ceremony.</p>
            <p className="mt-2 text-sm text-slate-500">
              The Committee Head publishes winners here during the Campus Clubs Excellence Awards.
            </p>
          </div>
        )}

        <div className="space-y-12">
          {byYear.map(([year, honors]) => (
            <section key={year}>
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700">Year</p>
                  <h2 className="font-display text-3xl font-medium text-[#1e3a5f]">{year}</h2>
                </div>
                <p className="text-xs font-semibold text-slate-400">{honors.length} honours</p>
              </div>
              <ol className="grid gap-4 md:grid-cols-2">
                {honors.map((honor) => (
                  <li
                    key={honor.id || `${year}-${honor.award}-${honor.club_name}`}
                    className="rounded-[26px] border border-amber-100/80 bg-[rgba(255,252,247,0.9)] p-5 shadow-card backdrop-blur-md"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                      {honor.award}
                    </p>
                    {honor.club ? (
                      <Link
                        to={`/clubs/${honor.club}`}
                        className="mt-1 block font-display text-xl font-medium text-[#1e3a5f] hover:text-sky-700"
                      >
                        {honor.club_name}
                      </Link>
                    ) : (
                      <p className="mt-1 font-display text-xl font-medium text-[#1e3a5f]">{honor.club_name}</p>
                    )}
                    {honor.award_description && (
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        {honor.award_description}
                      </p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{honor.citation}</p>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
