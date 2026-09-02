import { useParams } from "react-router-dom";
import { SectionHeading } from "../components/ui/SectionHeading";
import { StatusBadge } from "../components/ui/StatusBadge";
import { MOCK_PORTFOLIO } from "../data/mockClubs";

/**
 * PRS §6: "Portfolio storytelling should follow: Problem -> Objective ->
 * What we did -> Who participated -> Who benefited -> Evidence -> Results
 * -> Lessons -> Next steps." This page follows that sequence literally,
 * per verified activity and impact project, rather than showing a flat
 * file list — this is the platform's real differentiator over a generic
 * document repository.
 */
export function ClubPortfolio() {
  useParams(); // clubId — wired to api.clubs.portfolio(id) once the backend is live
  const club = MOCK_PORTFOLIO;

  return (
    <div>
      {/* Passport header */}
      <section className="border-b border-fog-line bg-ink">
        <div className="mx-auto flex max-w-4xl items-center gap-5 px-6 py-14">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-fog font-display text-2xl text-ink">
            {club.logo_initial}
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-brass">
              {club.category}
            </p>
            <h1 className="font-display text-3xl font-semibold text-fog">{club.name}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-fog/70">{club.mission}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-16 px-6 py-14">
        {club.verified_activities.map((activity, i) => (
          <article key={i} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-ink">{activity.title}</h2>
              <StatusBadge status="verified" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <SectionHeading mark="Objective" title="What we set out to do" />
                <p className="text-sm leading-relaxed text-ink-500">{activity.objective}</p>
              </div>
              <div className="space-y-2">
                <SectionHeading mark="Results" title="What happened" />
                <p className="text-sm leading-relaxed text-ink-500">{activity.report_text}</p>
              </div>
            </div>

            <p className="font-mono text-xs text-ink-300">
              {new Date(activity.date_time).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </article>
        ))}

        <hr className="border-fog-line" />

        {club.impact_projects.map((project, i) => (
          <article key={i} className="space-y-6">
            <h2 className="font-display text-2xl font-semibold text-ink">{project.title}</h2>

            <div className="space-y-2">
              <SectionHeading mark="Problem" title="Why this mattered" />
              <p className="text-sm leading-relaxed text-ink-500">{project.problem_statement}</p>
            </div>
            <div className="space-y-2">
              <SectionHeading mark="Who benefited" title="Beneficiaries" />
              <p className="text-sm leading-relaxed text-ink-500">
                {project.beneficiaries_description}
              </p>
            </div>
            <div className="space-y-2">
              <SectionHeading mark="Outcomes" title="Measured impact" />
              <p className="text-sm leading-relaxed text-ink-500">{project.outcomes}</p>
            </div>
            <div className="rounded-card bg-brass-soft/60 p-5">
              <SectionHeading mark="Next steps" title="Where this goes next" />
              <p className="mt-2 text-sm leading-relaxed text-ink-700">{project.next_steps}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
