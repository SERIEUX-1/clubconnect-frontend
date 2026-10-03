import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { canAccessPath, dashboardPathForRole } from "../../lib/roles";
import { useI18n } from "../../i18n/I18nProvider";

export function RequireRole({ children, path }) {
  const { user, isAuthenticated, openAuthModal, loading } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  const routePath = path || location.pathname;

  useEffect(() => {
    if (!loading && !isAuthenticated) openAuthModal("login");
  }, [loading, isAuthenticated, openAuthModal]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center text-slate-500 text-sm">
        {t("app.checkingCampus")}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="text-xl font-bold text-slate-900">{t("auth.schoolEmailTitle")}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {t("auth.schoolEmailBody")}
        </p>
      </div>
    );
  }

  if (!canAccessPath(user.role, routePath)) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />;
  }

  return children;
}
