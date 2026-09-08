import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SectionHeading } from "../components/ui/SectionHeading";
import { StatusBadge } from "../components/ui/StatusBadge";
import { api } from "../lib/api";

/**
 * PRS §6: "Portfolio storytelling should follow: Problem -> Objective ->
 * What we did -> Who participated -> Who benefited -> Evidence -> Results
 * -> Lessons -> Next steps." This page follows that sequence literally,
 * per verified activity and impact project, rather than showing a flat
 * file list — this is the platform's real differentiator over a generic
 * document repository.
 */
export function ClubPortfolio() {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.clubs.portfolio(clubId || "1")
      .then(setClub)
      .finally(() => setLoading(false));
  }, [clubId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-10 h-10 rounded-full border-4 border-sky-200 border-t-sky-500 animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading club portfolio…</p>
      </div>
    );
  }

  if (!club) return null;

  return (
    <div>
      {/* Passport header */}
      <section className="border-b border-sky-100 bg-gradient-to-r from-sky-600 to-blue-700 text-white">
        <div className="mx-auto flex max-w-4xl items-center gap-5 px-6 py-14">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr ${club.badge_color || "from-sky-500 to-blue-600"} font-bold text-2xl text-white shadow-lg`}>
            {club.logo_initial}
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-sky-200">
              {club.category}
            </p>
            <h1 className="font-bold text-3xl text-white mt-1">{club.name}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-sky-100">{club.mission}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-16 px-6 py-14">
        {(club.verified_activities || []).map((activity, i) => (
          <article key={i} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-2xl text-slate-900">{activity.title}</h2>
              <StatusBadge status="verified" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <SectionHeading mark="Objective" title="What we set out to do" />
                <p className="text-sm leading-relaxed text-slate-500">{activity.objective}</p>
              </div>
              <div className="space-y-2">
                <SectionHeading mark="Results" title="What happened" />
                <p className="text-sm leading-relaxed text-slate-500">{activity.report_text}</p>
              </div>
            </div>

            <p className="font-mono text-xs text-slate-400">
              {new Date(activity.date_time).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </article>
        ))}

        <hr className="border-slate-100" />

        {(club.impact_projects || []).map((project, i) => (
          <article key={i} className="space-y-6">
            <h2 className="font-bold text-2xl text-slate-900">{project.title}</h2>

            <div className="space-y-2">
              <SectionHeading mark="Problem" title="Why this mattered" />
              <p className="text-sm leading-relaxed text-slate-500">{project.problem_statement}</p>
            </div>
            <div className="space-y-2">
              <SectionHeading mark="Who benefited" title="Beneficiaries" />
              <p className="text-sm leading-relaxed text-slate-500">
                {project.beneficiaries_description}
              </p>
            </div>
            <div className="space-y-2">
              <SectionHeading mark="Outcomes" title="Measured impact" />
              <p className="text-sm leading-relaxed text-slate-500">{project.outcomes}</p>
            </div>
            <div className="rounded-2xl bg-sky-50 border border-sky-100 p-5">
              <SectionHeading mark="Next steps" title="Where this goes next" />
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{project.next_steps}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}


