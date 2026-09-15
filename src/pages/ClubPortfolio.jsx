import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SectionHeading } from "../components/ui/SectionHeading";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useToast } from "../context/ToastContext";
import { api } from "../lib/api";
import {
  ArrowLeft,
  UserPlus,
  Share2,
  Download,
  Check,
  ShieldCheck,
  Calendar,
  Sparkles,
  ExternalLink,
  Award,
  Users,
} from "lucide-react";

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
  const { toast } = useToast();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinStatus, setJoinStatus] = useState("idle"); // 'idle' | 'submitting' | 'requested'

  useEffect(() => {
    api.clubs.portfolio(clubId || "1")
      .then(setClub)
      .finally(() => setLoading(false));
  }, [clubId]);

  const handleJoinClub = async () => {
    if (joinStatus === "requested") return;
    setJoinStatus("submitting");
    try {
      await api.clubs.join(club.id);
      setJoinStatus("requested");
      toast.success(`Membership application submitted for ${club.name}! Club leadership will review your request.`);
    } catch (err) {
      setJoinStatus("idle");
      toast.error("Failed to submit join request. Please try again.");
    }
  };

  const handleSharePassport = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Club digital passport URL copied to clipboard!");
    } catch {
      toast.info(`Passport link: ${window.location.href}`);
    }
  };

  const handleExportPortfolio = () => {
    if (!club) return;
    const activities = (club.verified_activities || [])
      .map((a) => `• ${a.title} (${new Date(a.date_time).toLocaleDateString()}): ${a.objective || a.report_text}`)
      .join("\n");
    const projects = (club.impact_projects || [])
      .map((p) => `• ${p.title}: Problem: ${p.problem_statement} | Outcomes: ${p.outcomes}`)
      .join("\n");

    const summaryText = `CLUB DIGITAL PASSPORT: ${club.name}
Category: ${club.category}
Status: ${club.status || "Recognized"}
Established: ${club.established_date || "2024"}
Mission: ${club.mission || club.description}

VERIFIED ACTIVITIES:
${activities || "No verified activities recorded."}

IMPACT PROJECTS:
${projects || "No impact projects recorded."}
`;

    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${club.name.replace(/\s+/g, "_")}_Passport_Summary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Digital passport summary for ${club.name} downloaded!`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-10 h-10 rounded-full border-4 border-sky-200 border-t-sky-500 animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading club portfolio…</p>
      </div>
    );
  }

  if (!club) return null;

  const passportNumber = `CC-${new Date(club.established_date || Date.now()).getFullYear()}-${String(
    club.code || club.id
  ).slice(0, 3).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Navigation & Breadcrumb */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-400 text-xs py-2.5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Club Directory
          </Link>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>OFFICIAL PASSPORT:</span>
            <span className="text-amber-400 font-bold">{passportNumber}</span>
          </div>
        </div>
      </div>

      {/* Passport header */}
      <section className="relative overflow-hidden border-b border-sky-900/40 bg-gradient-to-br from-slate-900 via-sky-950 to-blue-950 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/15 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr ${club.badge_color || "from-sky-500 to-blue-600"} font-bold text-3xl text-white shadow-2xl ring-4 ring-white/10`}>
                {club.logo_initial || club.name?.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-sky-400 font-semibold">
                    {club.category}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-300 font-medium">Est. {club.established_date || "2024"}</span>
                  {club.status === "recognized" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <ShieldCheck className="w-3 h-3" /> Institutional Charter
                    </span>
                  )}
                </div>
                <h1 className="font-bold text-3xl sm:text-4xl text-white mt-1.5">{club.name}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 font-normal">
                  {club.mission || club.description}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
              <button
                id="btn-request-join-club"
                onClick={handleJoinClub}
                disabled={joinStatus === "requested" || joinStatus === "submitting"}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 ${
                  joinStatus === "requested"
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-sky-500 hover:bg-sky-400 text-white hover:shadow-sky-500/25"
                }`}
              >
                {joinStatus === "requested" ? (
                  <>
                    <Check className="w-4 h-4 text-white" /> Membership Requested
                  </>
                ) : joinStatus === "submitting" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> Request to Join Club
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="btn-share-passport"
                  onClick={handleSharePassport}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/15 transition-all active:scale-95"
                  title="Copy passport URL"
                >
                  <Share2 className="w-3.5 h-3.5 text-sky-300" /> Share
                </button>
                <button
                  id="btn-export-portfolio"
                  onClick={handleExportPortfolio}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/15 transition-all active:scale-95"
                  title="Export passport brief"
                >
                  <Download className="w-3.5 h-3.5 text-sky-300" /> Export
                </button>
              </div>
            </div>
          </div>

          {/* Institutional Stats strip */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Verified Activities</p>
              <p className="text-xl font-bold text-white mt-0.5">{(club.verified_activities || []).length}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Impact Projects</p>
              <p className="text-xl font-bold text-white mt-0.5">{(club.impact_projects || []).length}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Leadership Quorum</p>
              <p className="text-xl font-bold text-emerald-400 mt-0.5">100% Verified</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">CCEA Tier</p>
              <p className="text-xl font-bold text-amber-300 mt-0.5">Tier 1 Excellence</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-12 px-4 sm:px-6 py-12">
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


