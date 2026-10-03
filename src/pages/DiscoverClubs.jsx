import { useEffect, useMemo, useState } from "react";
import { PassportCard } from "../components/ui/PassportCard";
import { InstitutionMark } from "../components/brand/ClubConnectLogo";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { useI18n } from "../i18n/I18nProvider";

export function DiscoverClubs() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [clubs, setClubs] = useState([]);
  const campus = user?.institution;

  useEffect(() => {
    api.clubs.list().then((list) => {
      if (Array.isArray(list)) setClubs(list);
    });
  }, []);

  const CATEGORIES = ["All", ...new Set(clubs.map((c) => c.category).filter(Boolean))];

  const filtered = useMemo(() => {
    return clubs.filter((c) => {
      const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || c.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category, clubs]);

  return (
    <div>
      <section className="morning-hero">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-5">
            {campus?.logo_url ? (
              <h1 className="m-0 shrink-0">
                <InstitutionMark institution={campus} height={96} />
              </h1>
            ) : (
              <h1 className="font-display text-4xl font-medium leading-[1.08] text-[#1e3a5f] sm:text-5xl">
                {campus?.short_name || t("discover.clubs")}
              </h1>
            )}
            <div>
              <p className="max-w-lg text-sm leading-relaxed text-slate-600">
                {t("discover.signedIn", {
                  name: user?.full_name || "member",
                  role: String(user?.role || "").replace("_", " "),
                })}
              </p>
              <p className="mt-4 max-w-xl font-display text-xl italic leading-snug text-[#1d4e89]">
                {t("landing.missionLine")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-medium text-[#1e3a5f]">{t("discover.title")}</h2>
            <p className="text-sm text-slate-500">{t("discover.count", { n: filtered.length })}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " +
                  (category === cat
                    ? "border-sky-600 bg-sky-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-sky-300")
                }
              >
                {cat === "All" ? t("discover.all") : cat}
              </button>
            ))}
          </div>
        </div>

        <input
          type="search"
          placeholder={t("discover.search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-8 w-full max-w-sm rounded-full border border-amber-100 bg-white/80 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm backdrop-blur-sm"
          aria-label={t("discover.search")}
        />

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center">
            <p className="text-lg text-slate-900">{t("discover.empty")}</p>
            <p className="mt-1 text-sm text-slate-500">{t("discover.emptyHint")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((club) => (
              <PassportCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
