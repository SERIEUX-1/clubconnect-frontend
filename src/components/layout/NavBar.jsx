import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MOCK_PERSONAS } from "../../data/mockClubs";
import { dashboardPathForRole } from "../../lib/roles";
import { ClubConnectMark, InstitutionMark } from "../brand/ClubConnectLogo";
import { LanguageSelect } from "./LanguageSelect";
import { useI18n } from "../../i18n/I18nProvider";
import {
  Sparkles,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  Award,
  BarChart3,
  ChevronDown,
  LogOut,
  FileStack,
  Sliders,
  CircleHelp,
  Trophy,
  Shield,
  Users,
} from "lucide-react";

export function NavBar() {
  const { user, isAuthenticated, logout, switchPersona, openAuthModal, openLicenceModal } = useAuth();
  const { t } = useI18n();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.institution?.short_name) {
      document.title = `${user.institution.short_name} · ClubConnect`;
    } else {
      document.title = t("app.titlePublic");
    }
  }, [isAuthenticated, user?.institution?.short_name, t]);

  const role = user?.role || "student";

  // Dashboard path depending on active persona role
  const getDashboardPath = () => dashboardPathForRole(role);

  const handleSwitchPersona = async (targetRole) => {
    setRoleMenuOpen(false);
    await switchPersona(targetRole);
    navigate(dashboardPathForRole(targetRole));
  };

  const currentPersona = MOCK_PERSONAS.find((p) => p.role === role) || MOCK_PERSONAS[0];

  const showDemoSwitcher = user?.is_demo_account;

  return (
    <header className="sticky top-0 z-40 px-3 pb-2 pt-3 sm:px-5">
      {showDemoSwitcher && (
        <div className="mb-2 rounded-full border border-white/60 bg-white/35 px-4 py-1.5 text-xs text-slate-600 shadow-sm backdrop-blur-md">
        <div className="flex items-center space-x-2 max-w-6xl mx-auto w-full">
          <span className="flex items-center space-x-1 font-semibold text-sky-700">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
            <span>{t("nav.demoBanner")}</span>
          </span>

          <div className="relative inline-block">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white border border-sky-200 text-sky-800 font-medium hover:bg-sky-50 hover:border-sky-300 shadow-xs transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                {currentPersona.label}: <strong className="font-semibold text-slate-800">{user?.full_name || currentPersona.name}</strong>
              </span>
              <ChevronDown className="w-3 h-3 text-sky-500" />
            </button>

            {roleMenuOpen && (
              <div
                className="absolute left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-sky-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t("nav.demoSwitch")}
                </div>
                {MOCK_PERSONAS.map((p) => (
                  <button
                    key={p.role}
                    onClick={() => handleSwitchPersona(p.role)}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-sky-50 transition-colors ${
                      p.role === role ? "bg-sky-50/80 text-sky-700 font-semibold" : "text-slate-700"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-500">{p.label}</div>
                    </div>
                    {p.role === role && <span className="text-sky-600 font-bold text-xs">{t("nav.demoActive")}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="hidden md:inline-block text-[11px] text-slate-400">
            • Instant permissions testing for PRS §4 institutional workflows
          </span>
        </div>
      </div>
      )}

      {/* Main Navigation Bar */}
      <div className="nav-island mx-auto max-w-6xl">
        {/* Brand */}
        <NavLink to="/" className="flex shrink-0 items-center space-x-2.5 group">
          <ClubConnectMark size={36} className="group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="text-[17px] font-semibold tracking-tight text-[#101314]">
              ClubConnect
            </span>
            {isAuthenticated && user?.institution ? (
              <span className="mt-0.5">
                <InstitutionMark institution={user.institution} height={20} compact />
              </span>
            ) : (
              <span className="text-[10px] -mt-0.5 font-medium tracking-wide text-[#5E6E81]">
                {t("app.tagline")}
              </span>
            )}
          </div>
        </NavLink>

        {/* Navigation Links */}
        <nav className="hidden min-w-0 flex-1 items-center gap-0.5 overflow-x-auto md:flex">
          {isAuthenticated && (
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-[#101314] text-white"
                  : "text-[#5E6E81] hover:bg-[#F3F5F8] hover:text-[#101314]"
              }`
            }
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="sr-only xl:not-sr-only">{t("nav.discover")}</span>
          </NavLink>
          )}

          {isAuthenticated && (
          <NavLink
            to="/hall-of-excellence"
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-[#101314] text-white"
                  : "text-[#5E6E81] hover:bg-[#F3F5F8] hover:text-[#101314]"
              }`
            }
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="sr-only xl:not-sr-only">{t("nav.hall")}</span>
          </NavLink>
          )}

          {isAuthenticated && (
          <NavLink
            to={getDashboardPath()}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-[#101314] text-white"
                  : "text-[#5E6E81] hover:bg-[#F3F5F8] hover:text-[#101314]"
              }`
            }
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="sr-only xl:not-sr-only">{t("nav.dashboard")}</span>
          </NavLink>
          )}

          {(isAuthenticated && role === "committee_head") && (
            <NavLink
              to="/committee-dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#101314] text-white"
                    : "text-[#5E6E81] hover:bg-[#F3F5F8] hover:text-[#101314]"
                }`
              }
            >
              <FileStack className="w-3.5 h-3.5" />
              <span className="sr-only xl:not-sr-only">{t("nav.evidence")}</span>
            </NavLink>
          )}

          {(isAuthenticated && role === "committee_head") && (
            <NavLink
              to="/command-center"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#101314] text-white"
                    : "text-[#5E6E81] hover:bg-[#F3F5F8] hover:text-[#101314]"
                }`
              }
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="sr-only xl:not-sr-only">{t("nav.command")}</span>
            </NavLink>
          )}

          {(isAuthenticated && role === "committee_head") && (
            <NavLink
              to="/membership-ledger"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#101314] text-white"
                    : "text-[#5E6E81] hover:bg-[#F3F5F8] hover:text-[#101314]"
                }`
              }
            >
              <Users className="w-3.5 h-3.5" />
              <span className="sr-only xl:not-sr-only">{t("nav.membership")}</span>
            </NavLink>
          )}

          {(isAuthenticated && role === "committee_head") && (
            <NavLink
              to="/ccea-reveal"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#101314] text-white"
                    : "text-[#5E6E81] hover:bg-[#F3F5F8] hover:text-[#101314]"
                }`
              }
            >
              <Award className="w-3.5 h-3.5" />
              <span className="sr-only xl:not-sr-only">{t("nav.reveal")}</span>
            </NavLink>
          )}

          {(isAuthenticated && role === "system_admin") && (
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#101314] text-white"
                    : "text-[#5E6E81] hover:bg-[#F3F5F8] hover:text-[#101314]"
                }`
              }
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="sr-only xl:not-sr-only">{t("nav.campusAdmin")}</span>
            </NavLink>
          )}

          {(isAuthenticated && (role === "staff" || role === "system_admin")) && (
            <NavLink
              to="/staff-dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#101314] text-white"
                    : "text-[#5E6E81] hover:bg-[#F3F5F8] hover:text-[#101314]"
                }`
              }
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="sr-only xl:not-sr-only">{t("nav.analytics")}</span>
            </NavLink>
          )}
          <NavLink
            to="/trust"
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-[#101314] text-white"
                  : "text-[#5E6E81] hover:bg-[#F3F5F8] hover:text-[#101314]"
              }`
            }
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="sr-only xl:not-sr-only">{t("nav.trust")}</span>
          </NavLink>
          <NavLink
            to="/help"
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-[#101314] text-white"
                  : "text-[#5E6E81] hover:bg-[#F3F5F8] hover:text-[#101314]"
              }`
            }
          >
            <CircleHelp className="w-3.5 h-3.5" />
            <span className="sr-only xl:not-sr-only">{t("nav.help")}</span>
          </NavLink>
        </nav>

        {/* User / Authentication Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <NavLink
            to="/help"
            className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-white/70"
            aria-label={t("nav.help")}
          >
            <CircleHelp className="h-4 w-4" />
          </NavLink>
          <LanguageSelect />
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 rounded-xl p-1.5 pr-3 transition-all hover:bg-[#F3F5F8]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#101314] text-xs font-semibold text-white">
                  {user?.full_name ? user.full_name.charAt(0) : "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-none">
                    {user?.full_name || user?.username}
                  </div>
                  <div className="text-[10px] text-[#5E6E81] font-medium capitalize mt-0.5">
                    {role.replace("_", " ")}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-sky-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-200 capitalize">
                      {role.replace("_", " ")}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      openAuthModal("demo");
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 flex items-center space-x-2"
                  >
                    <Sliders className="w-3.5 h-3.5 text-sky-500" />
                    <span>{t("nav.switchPersona")}</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t("nav.signOut")}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => openLicenceModal()}
                className="hidden sm:inline rounded-xl px-3 py-2 text-xs font-semibold text-[#5E6E81] hover:bg-[#F3F5F8] hover:text-[#101314]"
              >
                {t("nav.licence")}
              </button>
              <button
                onClick={() => openAuthModal("login")}
                className="rounded-xl px-3.5 py-2 text-xs font-semibold text-[#5E6E81] hover:bg-[#F3F5F8] hover:text-[#101314]"
              >
                {t("nav.signIn")}
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="sun-cta rounded-xl px-3.5 py-2 text-xs font-semibold text-white"
              >
                {t("nav.createAccount")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
