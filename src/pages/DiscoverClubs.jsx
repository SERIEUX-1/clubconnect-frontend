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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <section className="community-frame px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-5">
            {campus?.logo_url ? (
              <h1 className="m-0 shrink-0">
                <InstitutionMark institution={campus} height={72} />
              </h1>
            ) : null}
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#101314] sm:text-4xl">
                {campus?.short_name || t("discover.clubs")}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5E6E81]">
                {t("discover.signedIn", {
                  name: user?.full_name || "member",
                  role: String(user?.role || "").replace("_", " "),
                })}
              </p>
            </div>
          </div>
          <input
            type="search"
            placeholder={t("discover.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-[#E4E7EE] bg-[#FBFBFD] px-4 py-2.5 text-sm text-[#101314] placeholder:text-[#8b93a7] transition focus:border-[#3b9be8] focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,155,232,0.16)] lg:max-w-xs"
            aria-label={t("discover.search")}
          />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold tracking-tight text-[#101314]">{t("discover.title")}</h2>
          <p className="text-sm text-[#8b93a7]">{t("discover.count", { n: filtered.length })}</p>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const count = cat === "All" ? clubs.length : clubs.filter((club) => club.category === cat).length;
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={
                    "inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition active:scale-95 " +
                    (active
                      ? "bg-[#101314] text-white shadow-[0_10px_20px_-12px_rgba(16,19,20,0.8)]"
                      : "bg-[#F3F5F8] text-[#5E6E81] hover:-translate-y-0.5 hover:bg-white hover:text-[#101314]")
                  }
                >
                  {cat === "All" ? t("discover.all") : cat}
                  <span className={active ? "text-white/70" : "text-[#8b93a7]"}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#E4E7EE] bg-[#FBFBFD] px-8 py-16 text-center">
            <p className="text-lg font-semibold text-[#101314]">{t("discover.empty")}</p>
            <p className="mt-1 text-sm text-[#5E6E81]">{t("discover.emptyHint")}</p>
          </div>
        ) : (
          <div key={`${category}-${query}`} className="mt-6 grid grid-cols-1 gap-3 xl:grid-cols-2">
            {filtered.map((club, index) => (
              <div key={club.id} className="cc-rise" style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}>
                <PassportCard club={club} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
