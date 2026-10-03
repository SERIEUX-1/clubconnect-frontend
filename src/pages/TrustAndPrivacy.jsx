import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n/I18nProvider";

export function TrustAndPrivacy() {
  const { t } = useI18n();
  const { user, isAuthenticated, openLicenceModal } = useAuth();
  const campus = user?.institution?.name;
  const privacy = user?.institution?.privacy_contact_email;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e07a5f]">{t("trust.kicker")}</p>
      <h1 className="mt-2 flex items-center gap-3 font-display text-4xl text-[#1e3a5f]">
        <ShieldCheck className="h-9 w-9 text-sky-600" />
        {t("trust.title")}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{t("trust.lead")}</p>

      <div className="mt-8 space-y-5">
        {[
          ["trust.s1t", "trust.s1b"],
          ["trust.s2t", "trust.s2b"],
          ["trust.s3t", "trust.s3b"],
          ["trust.s4t", "trust.s4b"],
        ].map(([title, body]) => (
          <section key={title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl text-[#1e3a5f]">{t(title)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(body)}</p>
          </section>
        ))}
      </div>

      {isAuthenticated && campus ? (
        <p className="mt-8 text-sm text-slate-600">
          {t("trust.campus", { campus })}
          {privacy ? ` ${privacy}` : ` ${t("trust.noContact")}`}
        </p>
      ) : (
        <p className="mt-8 text-sm text-slate-600">{t("trust.publicNote")}</p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/help" className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-[#1e3a5f]">
          {t("nav.help")}
        </Link>
        <button type="button" onClick={() => openLicenceModal()} className="sun-cta rounded-full px-5 py-2 text-sm font-semibold text-white">
          {t("landing.licence")}
        </button>
      </div>
    </div>
  );
}
