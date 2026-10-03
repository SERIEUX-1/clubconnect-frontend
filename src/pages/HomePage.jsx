import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n/I18nProvider";
import { DiscoverClubs } from "./DiscoverClubs";
import { Landing } from "./Landing";

export function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="px-6 py-24 text-center text-sm text-slate-500">{t("app.loading")}</div>
    );
  }

  return isAuthenticated ? <DiscoverClubs /> : <Landing />;
}
