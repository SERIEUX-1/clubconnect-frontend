import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SectionHeading } from "../components/ui/SectionHeading";
import { StatusBadge } from "../components/ui/StatusBadge";
import { PublishedWatch } from "../components/clubs/PublishedWatch";
import { PublishWatchModal } from "../components/leader/PublishWatchModal";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { useMembershipWindow } from "../hooks/useMembershipWindow";
import {
  ArrowLeft,
  UserPlus,
  Share2,
  Download,
  Check,
  ShieldCheck,
  PlayCircle,
  MapPin,
  Users,
  Mail,
  ScrollText,
  Upload,
} from "lucide-react";

export function ClubPortfolio() {
  const { clubId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinStatus, setJoinStatus] = useState("idle");
  const [tab, setTab] = useState("watch");
  const [publishOpen, setPublishOpen] = useState(false);
  const { open: censusOpen, loading: censusLoading } = useMembershipWindow();

  useEffect(() => {
    setLoading(true);
    setError("");
    api.clubs
      .portfolio(clubId)
      .then((data) => {
        setClub(data);
        const videos = (data.published_media || []).filter((m) => m.is_video);
        setTab(videos.length || (data.published_media || []).length ? "watch" : "activities");
      })
      .catch((err) => {
        setClub(null);
        setError(err.message || "This club page could not be opened.");
      })
      .finally(() => setLoading(false));
  }, [clubId]);

  const leadsThisClub =
    !!club && (user?.led_clubs || []).map(String).includes(String(club.id));
  const canRequestMembership =
    (user?.role === "student" || user?.role === "club_leader") && !leadsThisClub;
  const canJoin = canRequestMembership && censusOpen;
  const canPublish = leadsThisClub;
  const activities = club?.verified_activities || [];
  const projects = club?.impact_projects || [];
  const gallery = club?.published_media || [];
  const videos = useMemo(() => gallery.filter((m) => m.is_video), [gallery]);

  const handleJoinClub = async () => {
    if (joinStatus === "requested" || !canJoin) return;
    setJoinStatus("submitting");
    try {
      await api.clubs.join(club.id);
      setJoinStatus("requested");
      toast.success(`Membership application submitted for ${club.name}.`);
    } catch (err) {
      setJoinStatus("idle");
      toast.error(err.message || "Failed to submit join request.");
    }
  };

  const handleSharePassport = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Club page link copied.");
    } catch {
      toast.info(`Link: ${window.location.href}`);
    }
  };

  const handleExportPortfolio = () => {
    if (!club) return;
    const activityLines = activities
      .map((a) => `• ${a.title}: ${a.objective || a.report_text}`)
      .join("\n");
    const projectLines = projects
      .map((p) => `• ${p.title}: ${p.outcomes || p.problem_statement}`)
      .join("\n");
    const mediaLines = gallery.map((m) => `• ${m.caption} (${m.url})`).join("\n");
    const blob = new Blob(
      [
        `${club.name}\n${club.mission || club.description}\n\nACTIVITIES\n${activityLines}\n\nPROJECTS\n${projectLines}\n\nWATCH\n${mediaLines}\n`,
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${club.name.replace(/\s+/g, "_")}_Campus_Page.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-10 h-10 rounded-full border-4 border-sky-200 border-t-sky-500 animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Opening club page…</p>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="font-semibold text-slate-800">This club is not on the campus directory yet.</p>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
        <Link to="/clubs" className="mt-6 inline-flex text-sm font-semibold text-sky-700">
          Back to Discover
        </Link>
      </div>
    );
  }

  const passportNumber = `CC-${new Date(club.established_date || Date.now()).getFullYear()}-${String(
    club.slug || club.id
  )
    .slice(0, 8)
    .toUpperCase()}`;

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-slate-900/90 border-b border-slate-800 text-slate-400 text-xs py-2.5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/clubs"
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All campus clubs
          </Link>
          <span className="font-mono text-[11px] text-amber-400 font-bold">{passportNumber}</span>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-sky-900/40 bg-gradient-to-br from-slate-900 via-sky-950 to-blue-950 text-white">
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky-500 to-amber-400 font-bold text-3xl text-white shadow-2xl ring-4 ring-amber-200/50">
                {club.logo_initial || club.name?.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-sky-400 font-semibold">
                    {club.category}
                  </span>
                  {club.status === "recognized" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <ShieldCheck className="w-3 h-3" /> Published for this campus
                    </span>
                  )}
                </div>
                <h1 className="font-bold text-3xl sm:text-4xl text-white mt-1.5">{club.name}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                  {club.mission || club.description}
                </p>
                <p className="mt-3 text-xs text-sky-200">
                  Every signed-in student, club leader, committee head, and staff member at this institution can watch the published films, photos, activities, and projects below.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
              {canPublish && (
                <button
                  type="button"
                  onClick={() => setPublishOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-md"
                >
                  <Upload className="w-4 h-4" /> Publish for campus to watch
                </button>
              )}
              {canJoin && (
                <button
                  onClick={handleJoinClub}
                  disabled={joinStatus === "requested" || joinStatus === "submitting"}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md ${
                    joinStatus === "requested"
                      ? "bg-emerald-600 text-white"
                      : "bg-sky-500 hover:bg-sky-400 text-white"
                  }`}
                >
                  {joinStatus === "requested" ? (
                    <>
                      <Check className="w-4 h-4" /> Membership Requested
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" /> Request to Join
                    </>
                  )}
                </button>
              )}
              {canRequestMembership && !canJoin && (
                <p className="max-w-[16rem] text-[11px] text-slate-300">
                  {censusLoading
                    ? "Checking whether the Committee Head has opened membership requests…"
                    : "Membership requests are closed until the Committee Head opens the campus window."}
                </p>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSharePassport}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/15"
                >
                  <Share2 className="w-3.5 h-3.5 text-sky-300" /> Share
                </button>
                <button
                  onClick={handleExportPortfolio}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/15"
                >
                  <Download className="w-3.5 h-3.5 text-sky-300" /> Export
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Videos & photos</p>
              <p className="text-xl font-bold text-white mt-0.5">{gallery.length}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Published activities</p>
              <p className="text-xl font-bold text-white mt-0.5">{activities.length}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Impact projects</p>
              <p className="text-xl font-bold text-white mt-0.5">{projects.length}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Films you can watch</p>
              <p className="text-xl font-bold text-amber-300 mt-0.5">{videos.length}</p>
            </div>
          </div>

          {(club.officers?.length || club.constitution_title || club.directory_notes) && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-amber-300 font-bold">Executive committee</p>
                  <p className="mt-1 text-sm text-slate-300">
                    {club.recognition_cycle
                      ? `Recognised ${club.recognition_cycle} in the ALCHE Clubs and Societies Database.`
                      : "Leaders recorded in the campus register."}
                  </p>
                </div>
                {club.constitution_title && (
                  <p className="inline-flex items-center gap-1.5 text-xs text-sky-200">
                    <ScrollText className="h-3.5 w-3.5" />
                    {club.constitution_title}
                  </p>
                )}
              </div>
              {club.officers?.length > 0 && (
                <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                  {club.officers.map((officer) => (
                    <li
                      key={`${officer.title}-${officer.name}`}
                      className="rounded-xl border border-white/10 bg-slate-950/30 px-3.5 py-3"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-sky-300">{officer.title}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{officer.name}</p>
                      {officer.email ? (
                        <a
                          href={`mailto:${officer.email}`}
                          className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-200 hover:text-amber-100 break-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-3 w-3 shrink-0" />
                          {officer.email}
                        </a>
                      ) : (
                        <p className="mt-1 text-[11px] text-slate-500">Campus email not listed in the register</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {club.directory_notes && (
                <p className="mt-4 text-xs leading-relaxed text-slate-400">{club.directory_notes}</p>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { id: "watch", label: `Watch (${gallery.length})` },
            { id: "activities", label: `Activities (${activities.length})` },
            { id: "projects", label: `Projects (${projects.length})` },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold ${
                tab === item.id ? "bg-sky-600 text-white" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "watch" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-sky-600" />
              <h2 className="font-bold text-2xl text-slate-900">Published work you can watch</h2>
            </div>
            {gallery.length === 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-500">This club has not published videos or photos yet.</p>
                {canPublish && (
                  <button
                    type="button"
                    onClick={() => setPublishOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white"
                  >
                    <Upload className="h-3.5 w-3.5" /> Publish the first film or photo
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {gallery.map((item) => (
                  <PublishedWatch key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "activities" && (
          <div className="space-y-12">
            {activities.length === 0 && (
              <p className="text-sm text-slate-500">No verified activities have been published yet.</p>
            )}
            {activities.map((activity) => (
              <article key={activity.id || activity.title} className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-sky-600 font-bold">
                      {activity.activity_type || "Activity"}
                    </p>
                    <h2 className="font-bold text-2xl text-slate-900">{activity.title}</h2>
                  </div>
                  <StatusBadge status="verified" />
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  {activity.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {activity.location}
                    </span>
                  )}
                  {activity.actual_participation ? (
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {activity.actual_participation} took part
                    </span>
                  ) : null}
                  {activity.date_time && (
                    <span>
                      {new Date(activity.date_time).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <SectionHeading mark="Objective" title="What we set out to do" />
                    <p className="text-sm leading-relaxed text-slate-600">{activity.objective}</p>
                  </div>
                  <div className="space-y-2">
                    <SectionHeading mark="Results" title="What happened" />
                    <p className="text-sm leading-relaxed text-slate-600">{activity.report_text || activity.description}</p>
                  </div>
                </div>
                {(activity.media || []).length > 0 && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {activity.media.map((item) => (
                      <PublishedWatch key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {tab === "projects" && (
          <div className="space-y-12">
            {projects.length === 0 && (
              <p className="text-sm text-slate-500">No impact projects have been published yet.</p>
            )}
            {projects.map((project) => (
              <article key={project.id || project.title} className="space-y-5">
                <h2 className="font-bold text-2xl text-slate-900">{project.title}</h2>
                {(project.media || []).length > 0 && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {project.media.map((item) => (
                      <PublishedWatch key={item.id} item={item} />
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <SectionHeading mark="Problem" title="Why this mattered" />
                  <p className="text-sm leading-relaxed text-slate-600">{project.problem_statement}</p>
                </div>
                <div className="space-y-2">
                  <SectionHeading mark="Who benefited" title="Beneficiaries" />
                  <p className="text-sm leading-relaxed text-slate-600">{project.beneficiaries_description}</p>
                </div>
                <div className="space-y-2">
                  <SectionHeading mark="Outcomes" title="Measured impact" />
                  <p className="text-sm leading-relaxed text-slate-600">{project.outcomes}</p>
                </div>
                {project.next_steps && (
                  <div className="rounded-2xl bg-sky-50 border border-sky-100 p-5">
                    <SectionHeading mark="Next steps" title="Where this goes next" />
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">{project.next_steps}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
      <PublishWatchModal
        isOpen={publishOpen}
        onClose={() => setPublishOpen(false)}
        clubId={club.id}
        clubName={club.name}
        onPublished={(item) => {
          setClub((prev) => {
            if (!prev) return prev;
            const media = [item, ...(prev.published_media || [])];
            return { ...prev, published_media: media, published_watch_count: media.length };
          });
          setTab("watch");
        }}
      />
    </div>
  );
}
