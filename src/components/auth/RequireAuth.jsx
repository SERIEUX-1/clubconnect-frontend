import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../i18n/I18nProvider";
import { Landing } from "../../pages/Landing";

export function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useI18n();

  if (loading) {
    return <div className="px-6 py-24 text-center text-sm text-slate-500">{t("app.checkingAccess")}</div>;
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return children;
}
