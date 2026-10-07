import { useState } from "react";
import { Link } from "react-router-dom";
import { ClubConnectMark } from "../components/brand/ClubConnectLogo";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n/I18nProvider";

const PREVIEW = [
  {
    tone: "from-[#6fafdf] to-[#2f6f9e]",
    who: "Amina",
    chip: "Workshop",
    title: "The first room you walk into",
    when: "Sunday · 10:10",
    going: 12,
  },
  {
    tone: "from-[#e0a06a] to-[#c46a3a]",
    who: "Leo",
    chip: "Deep dive",
    title: "Writing the year together",
    when: "Tuesday · 18:30",
    going: 8,
  },
  {
    tone: "from-[#7dcaa8] to-[#2f8a68]",
    who: "Noor",
    chip: "Masterclass",
    title: "How a campus makes its leaders",
    when: "Thursday · 16:00",
    going: 21,
  },
];

const PREVIEW_TABS = ["All", "Workshop", "Deep dive", "Masterclass"];

const CLUB_ROWS = [
  { name: "Robotics", meta: "24 members · Technology", tone: "from-[#6fafdf] to-[#2f6f9e]" },
  { name: "A cappella", meta: "18 members · Arts", tone: "from-[#f0a0b0] to-[#c45d74]" },
  { name: "Garden club", meta: "15 members · Sustainability", tone: "from-[#7dcaa8] to-[#2f8a68]" },
];

const PEOPLE = ["Amina", "Leo", "Noor", "Imani", "Jonas", "Priya"];

function PersonTile({ tone, who }) {
  return (
    <div className={`relative h-[108px] w-[132px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br sm:w-[148px] ${tone}`}>
      <div className="absolute -bottom-8 left-1/2 h-24 w-28 -translate-x-1/2 rounded-[50%] bg-white/20" />
      <div className="absolute bottom-7 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full bg-white/85 shadow-sm" />
      <span className="absolute bottom-2 left-3 text-[11px] font-semibold text-white">{who}</span>
    </div>
  );
}

export function Landing() {
  const { openAuthModal, openLicenceModal } = useAuth();
  const { t } = useI18n();
  const [panel, setPanel] = useState("Events");
  const [tab, setTab] = useState("All");
  const [going, setGoing] = useState({});
  const [arc, setArc] = useState(2);
  const steps = [
    { n: "01", title: t("landing.s1t"), body: t("landing.s1b") },
    { n: "02", title: t("landing.s2t"), body: t("landing.s2b") },
    { n: "03", title: t("landing.s3t"), body: t("landing.s3b") },
  ];
  const roles = [
    { title: t("roles.student"), email: t("landing.rStudentMail"), body: t("landing.rStudent") },
    { title: t("roles.club_leader"), email: t("landing.rLeaderMail"), body: t("landing.rLeader") },
    { title: t("roles.committee_head"), email: t("landing.rHeadMail"), body: t("landing.rHead") },
    { title: t("roles.staff"), email: t("landing.rStaffMail"), body: t("landing.rStaff") },
  ];
  const side = ["Feed", "Clubs", "Events", "Members", "About"];
  const visible = PREVIEW.filter((row) => tab === "All" || row.chip === tab);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-6 lg:pt-10">
        <div>
          <p className="mb-5 inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5E6E81] shadow-sm">
            {t("landing.kicker")}
          </p>
          <div className="mb-6 flex items-center gap-3">
            <ClubConnectMark size={42} />
            <span className="text-sm font-semibold tracking-tight text-[#101314]">ClubConnect</span>
          </div>
          <h1 className="max-w-xl text-[2.7rem] font-semibold leading-[1.05] tracking-tight text-[#101314] sm:text-6xl">
            {t("landing.h1a")}
            <span className="mt-1 block text-[#3b9be8]">{t("landing.h1b")}</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#5E6E81] sm:text-lg">
            {t("landing.lead")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => openAuthModal("login")} className="sun-cta rounded-xl px-5 py-3 text-sm font-semibold text-white">
              {t("landing.enter")}
            </button>
            <button type="button" onClick={() => openAuthModal("register")} className="rounded-xl border border-[#E4E7EE] bg-white px-5 py-3 text-sm font-semibold text-[#101314] shadow-sm transition hover:-translate-y-0.5 hover:border-[#3b9be8] hover:bg-[#F7F8FB]">
              {t("landing.create")}
            </button>
          </div>
          <button type="button" onClick={() => openLicenceModal()} className="mt-4 block text-sm font-semibold text-[#5F92B2] hover:text-[#101314]">
            {t("landing.licence")}
          </button>
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-[#8b93a7]">{t("landing.footnote")}</p>
        </div>

        <div className="community-frame cc-float p-3 sm:p-4">
          <div className="flex overflow-hidden rounded-[22px] border border-[#EEF0F5] bg-white">
            <aside className="hidden w-40 shrink-0 border-r border-[#EEF0F5] bg-[#FBFBFD] px-3 py-4 sm:block">
              <p className="px-2 text-[11px] font-semibold text-[#101314]">Campus</p>
              <ul className="mt-3 space-y-1">
                {side.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => setPanel(item)}
                      className={
                        "w-full rounded-lg px-2.5 py-1.5 text-left text-[13px] transition " +
                        (item === panel ? "bg-[#101314] font-medium text-white" : "text-[#5E6E81] hover:bg-white hover:text-[#101314]")
                      }
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
            <div className="min-w-0 flex-1 p-4 sm:p-5">
              <div className="mb-3 flex gap-2 overflow-x-auto sm:hidden">
                {side.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPanel(item)}
                    className={
                      "shrink-0 rounded-full px-3 py-1 text-xs font-semibold " +
                      (item === panel ? "bg-[#101314] text-white" : "bg-[#F3F5F8] text-[#5E6E81]")
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>
              {panel === "Events" && (
                <>
                  <h2 className="text-lg font-semibold tracking-tight text-[#101314]">Campus events</h2>
                  <p className="mt-1 max-w-sm text-xs leading-relaxed text-[#5E6E81]">{t("landing.missionBody")}</p>
                  <div className="mt-4 flex gap-4 border-b border-[#EEF0F5] text-xs font-medium">
                    {PREVIEW_TABS.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setTab(name)}
                        className={"pb-2 transition " + (tab === name ? "border-b-2 border-[#101314] text-[#101314]" : "text-[#8b93a7] hover:text-[#101314]")}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 space-y-3">
                    {visible.map((row) => {
                      const joined = Boolean(going[row.title]);
                      return (
                        <article key={row.title} className="cc-rise flex gap-3 rounded-2xl border border-[#EEF0F5] p-2.5 transition hover:-translate-y-0.5 hover:border-[#c5dff6] hover:shadow-[0_16px_30px_-22px_rgba(59,155,232,0.7)] sm:gap-4 sm:p-3">
                          <PersonTile tone={row.tone} who={row.who} />
                          <div className="flex min-w-0 flex-1 flex-col justify-center">
                            <p className="text-[11px] font-semibold text-[#5F92B2]">{row.chip}</p>
                            <h3 className="mt-0.5 truncate text-sm font-semibold text-[#101314] sm:text-[15px]">{row.title}</h3>
                            <p className="mt-1 text-xs text-[#5E6E81]">{row.when}</p>
                            <div className="mt-3 flex items-center justify-between gap-2">
                              <span className="text-[11px] text-[#8b93a7]">{row.going + (joined ? 1 : 0)} going</span>
                              <button
                                type="button"
                                onClick={() => setGoing((current) => ({ ...current, [row.title]: !current[row.title] }))}
                                className={
                                  "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition active:scale-95 " +
                                  (joined ? "bg-[#101314] text-white" : "bg-[#3b9be8] text-white hover:bg-[#2b8ad4]")
                                }
                              >
                                {joined ? "Going" : "RSVP"}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                    {visible.length === 0 && (
                      <p className="rounded-2xl bg-[#FBFBFD] px-4 py-8 text-center text-sm text-[#5E6E81]">Nothing in that room yet.</p>
                    )}
                  </div>
                </>
              )}
              {panel === "Clubs" && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold tracking-tight text-[#101314]">Clubs on campus</h2>
                  {CLUB_ROWS.map((club) => (
                    <button
                      key={club.name}
                      type="button"
                      onClick={() => openAuthModal("login")}
                      className="flex w-full items-center gap-3 rounded-2xl border border-[#EEF0F5] p-3 text-left transition hover:-translate-y-0.5 hover:border-[#c5dff6]"
                    >
                      <span className={`h-12 w-12 rounded-xl bg-gradient-to-br ${club.tone}`} />
                      <span>
                        <span className="block text-sm font-semibold text-[#101314]">{club.name}</span>
                        <span className="text-xs text-[#5E6E81]">{club.meta}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {panel === "Members" && (
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-[#101314]">People in the room</h2>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {PEOPLE.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => openAuthModal("register")}
                        className="rounded-2xl border border-[#EEF0F5] px-2 py-4 text-center transition hover:-translate-y-0.5 hover:border-[#c5dff6] hover:bg-[#F7FBFF]"
                      >
                        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#101314] text-sm font-semibold text-white">
                          {name.charAt(0)}
                        </span>
                        <span className="mt-2 block text-xs font-semibold text-[#101314]">{name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {panel === "Feed" && (
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-[#101314]">Just now</h2>
                  <ul className="mt-4 space-y-3 text-sm text-[#5E6E81]">
                    <li className="rounded-2xl bg-[#FBFBFD] px-4 py-3">Amina checked in to Robotics lab.</li>
                    <li className="rounded-2xl bg-[#FBFBFD] px-4 py-3">Leo published a film from the garden project.</li>
                    <li className="rounded-2xl bg-[#FBFBFD] px-4 py-3">Noor opened next week’s masterclass.</li>
                  </ul>
                </div>
              )}
              {panel === "About" && (
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-[#101314]">{t("landing.missionLine")}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#5E6E81]">{t("landing.missionBody")}</p>
                  <button type="button" onClick={() => openLicenceModal()} className="sun-cta mt-5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white">
                    {t("landing.licence")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5F92B2]">{t("landing.missionKicker")}</p>
        <blockquote className="mt-4 text-center text-3xl font-semibold leading-[1.15] tracking-tight text-[#101314] sm:text-5xl">
          {t("landing.missionLine")}
        </blockquote>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-[#5E6E81]">
          {t("landing.missionBody")}
        </p>
        <ol className="cc-mission-arc mt-10">
          {[1, 2, 3, 4].map((n) => (
            <li key={n}>
              <button
                type="button"
                onClick={() => setArc(n)}
                className={"w-full rounded-[1.15rem] px-2 py-4 text-[0.82rem] font-semibold transition " + (arc === n ? "bg-[#101314] text-white" : "text-[#101314] hover:bg-white")}
              >
                {t(`landing.missionArc${n}`)}
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-center text-lg font-medium text-[#5F92B2]">{t("landing.missionBelieve")}</p>
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={() => openLicenceModal()} className="sun-cta rounded-xl px-6 py-3 text-sm font-semibold text-white">
            {t("landing.missionCta")}
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5F92B2]">{t("landing.craft")}</p>
        <h2 className="mt-2 text-center text-3xl font-semibold tracking-tight text-[#101314] sm:text-4xl">{t("landing.holds")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-[#5E6E81]">{t("landing.holdsLead")}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="rounded-3xl border border-[#E7EAF1] bg-white p-7 text-left shadow-[0_18px_40px_-28px_rgba(16,19,20,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#c5dff6] hover:shadow-[0_24px_40px_-24px_rgba(59,155,232,0.55)]">
              <p className="text-sm font-semibold text-[#3b9be8]">{step.n}</p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-[#101314]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5E6E81]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-8">
        <div className="rounded-[28px] bg-white px-6 py-14 shadow-[0_24px_50px_-32px_rgba(16,19,20,0.3)] sm:px-10">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5F92B2]">{t("landing.key")}</p>
          <h2 className="mt-2 text-center text-3xl font-semibold tracking-tight text-[#101314] sm:text-4xl">{t("landing.perms")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-[#5E6E81]">{t("landing.permsLead")}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {roles.map((role) => (
              <button key={role.title} type="button" onClick={() => openAuthModal("login")} className="rounded-2xl border border-[#EEF0F5] bg-[#FBFBFD] p-6 text-left transition hover:-translate-y-1 hover:border-[#3b9be8] hover:bg-white">
                <h3 className="text-xl font-semibold tracking-tight text-[#101314]">{role.title}</h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5F92B2]">{role.email}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#5E6E81]">{role.body}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 pt-12 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5F92B2]">{t("landing.another")}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#101314] sm:text-4xl">{t("landing.found")}</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#5E6E81]">{t("landing.foundLead")}</p>
        <button type="button" onClick={() => openLicenceModal()} className="sun-cta mt-8 rounded-xl px-6 py-3 text-sm font-semibold text-white">
          {t("landing.reach")}
        </button>
        <p className="mt-10 text-xs text-[#8b93a7]">
          <Link to="/trust" className="font-semibold text-[#5F92B2] hover:text-[#101314]">{t("nav.trust")}</Link>
          {" · "}
          <Link to="/help" className="font-semibold text-[#5F92B2] hover:text-[#101314]">{t("nav.help")}</Link>
        </p>
      </section>
    </div>
  );
}
