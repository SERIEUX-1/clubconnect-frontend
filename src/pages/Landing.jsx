import { Link } from "react-router-dom";
import { ClubConnectLogo } from "../components/brand/ClubConnectLogo";
import { ClubConstellation } from "../components/brand/ClubConstellation";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n/I18nProvider";

export function Landing() {
  const { openAuthModal, openLicenceModal } = useAuth();
  const { t } = useI18n();
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

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-6 opacity-70">
          <ClubConstellation className="mx-auto h-36 w-full max-w-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-28 pt-20 text-center sm:pt-28">
          <p className="mb-7 rounded-full border border-white bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#1e3a5f] shadow-sm">
            {t("landing.kicker")}
          </p>
          <ClubConnectLogo size={92} stacked wordmark />
          <h1 className="mt-8 max-w-2xl font-display text-5xl font-medium leading-[1.05] text-[#1e3a5f] sm:text-6xl">
            {t("landing.h1a")}
            <span className="mt-1 block italic text-[#e07a5f]">{t("landing.h1b")}</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-700 sm:text-lg">
            {t("landing.lead")}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={() => openAuthModal("login")} className="sun-cta rounded-full px-8 py-3.5 text-sm font-semibold text-white">
              {t("landing.enter")}
            </button>
            <button type="button" onClick={() => openAuthModal("register")} className="rounded-full border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-[#1e3a5f] shadow-sm hover:bg-slate-50">
              {t("landing.create")}
            </button>
            <button type="button" onClick={() => openLicenceModal()} className="rounded-full border border-[#e07a5f]/40 bg-[#fff6f0] px-8 py-3.5 text-sm font-semibold text-[#9a3412] shadow-sm hover:bg-white">
              {t("landing.licence")}
            </button>
          </div>
          <p className="mt-5 text-xs tracking-wide text-slate-600">{t("landing.footnote")}</p>
        </div>
      </section>

      <section className="cc-mission mx-auto max-w-4xl px-6 pb-20">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.32em] text-[#e07a5f]">{t("landing.missionKicker")}</p>
        <blockquote className="mt-4 text-center font-display text-4xl font-medium leading-[1.12] text-[#1e3a5f] sm:text-5xl">
          {t("landing.missionLine")}
        </blockquote>
        <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
          {t("landing.missionBody")}
        </p>
        <ol className="cc-mission-arc mt-10">
          {[1, 2, 3, 4].map((n) => (
            <li key={n}>
              <span>{t(`landing.missionArc${n}`)}</span>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-center font-display text-2xl italic text-[#1d4e89]">{t("landing.missionBelieve")}</p>
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={() => openLicenceModal()} className="sun-cta rounded-full px-8 py-3.5 text-sm font-semibold text-white">
            {t("landing.missionCta")}
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e07a5f]">{t("landing.craft")}</p>
        <h2 className="mt-2 text-center font-display text-4xl font-medium text-[#1e3a5f]">{t("landing.holds")}</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-slate-600">{t("landing.holdsLead")}</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="rounded-[28px] border border-slate-200 bg-white p-7 text-left shadow-card">
              <p className="font-display text-3xl italic text-[#e07a5f]">{step.n}</p>
              <h3 className="mt-3 font-display text-xl text-[#1e3a5f]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/50 bg-[#1e3a5f]/[0.06] backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-[#1d4e89]">{t("landing.key")}</p>
          <h2 className="mt-2 text-center font-display text-4xl font-medium text-[#1e3a5f]">{t("landing.perms")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-slate-600">{t("landing.permsLead")}</p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {roles.map((role) => (
              <div key={role.title} className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
                <h3 className="font-display text-2xl text-[#1e3a5f]">{role.title}</h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e07a5f]">{role.email}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{role.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 pt-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e07a5f]">{t("landing.another")}</p>
        <h2 className="mt-2 font-display text-4xl font-medium text-[#1e3a5f]">{t("landing.found")}</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">{t("landing.foundLead")}</p>
        <button type="button" onClick={() => openLicenceModal()} className="sun-cta mt-8 rounded-full px-8 py-3.5 text-sm font-semibold text-white">
          {t("landing.reach")}
        </button>
        <p className="mt-10 text-xs text-slate-500">
          <Link to="/trust" className="font-semibold text-[#1d4e89] hover:underline">{t("nav.trust")}</Link>
          {" · "}
          <Link to="/help" className="font-semibold text-[#1d4e89] hover:underline">{t("nav.help")}</Link>
        </p>
      </section>
    </div>
  );
}
