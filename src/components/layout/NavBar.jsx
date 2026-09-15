import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MOCK_PERSONAS } from "../../data/mockClubs";
import { dashboardPathForRole } from "../../lib/roles";
import {
  Sparkles,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  Award,
  BarChart3,
  ChevronDown,
  User,
  LogOut,
  Sliders,
} from "lucide-react";

export function NavBar() {
  const { user, isAuthenticated, logout, switchPersona, openAuthModal } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const role = user?.role || "student";

  // Dashboard path depending on active persona role
  const getDashboardPath = () => dashboardPathForRole(role);

  const handleSwitchPersona = async (targetRole) => {
    setRoleMenuOpen(false);
    await switchPersona(targetRole);
    navigate(dashboardPathForRole(targetRole));
  };

  const currentPersona = MOCK_PERSONAS.find((p) => p.role === role) || MOCK_PERSONAS[0];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-sky-100 shadow-sm">
      {/* Upper Persona Quick-Bar */}
      <div className="bg-gradient-to-r from-sky-50 via-sky-100/50 to-blue-50 border-b border-sky-100/80 px-4 py-1.5 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center space-x-2 max-w-6xl mx-auto w-full">
          <span className="flex items-center space-x-1 font-semibold text-sky-700">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
            <span>Role-Based Institutional View:</span>
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
                  Switch Active Role Demo
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
                    {p.role === role && <span className="text-sky-600 font-bold text-xs">Active</span>}
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

      {/* Main Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <NavLink to="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-sky-400 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
              ClubConnect
            </span>
            <span className="text-[10px] -mt-1 font-semibold text-sky-600 tracking-wide uppercase">
              Institutional Ecosystem
            </span>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1.5">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/25"
                  : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
              }`
            }
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Discover Clubs</span>
          </NavLink>

          <NavLink
            to={getDashboardPath()}
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/25"
                  : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
              }`
            }
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>My Dashboard</span>
          </NavLink>

          {(role === "committee_head" || role === "committee_member" || role === "dean_admin" || role === "system_admin") && (
            <NavLink
              to="/command-center"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-sky-500 text-white shadow-sm shadow-sky-500/25"
                    : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
                }`
              }
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Command Center</span>
            </NavLink>
          )}

          {(role === "committee_head" || role === "dean_admin" || role === "system_admin" || role === "committee_member") && (
            <NavLink
              to="/ccea-reveal"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-sky-500 text-white shadow-sm shadow-sky-500/25"
                    : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
                }`
              }
            >
              <Award className="w-3.5 h-3.5" />
              <span>CCEA Reveal Mode</span>
            </NavLink>
          )}

          {(role === "dean_admin" || role === "system_admin") && (
            <NavLink
              to="/dean-dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-sky-500 text-white shadow-sm shadow-sky-500/25"
                    : "text-slate-600 hover:text-sky-600 hover:bg-sky-50"
                }`
              }
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Institutional Analytics</span>
            </NavLink>
          )}
        </nav>

        {/* User / Authentication Actions */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-1.5 pr-3 rounded-full hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                  {user?.full_name ? user.full_name.charAt(0) : "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-none">
                    {user?.full_name || user?.username}
                  </div>
                  <div className="text-[10px] text-sky-600 font-medium capitalize mt-0.5">
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
                    <span>Switch Role Persona</span>
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
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => openAuthModal("login")}
                className="px-4 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal("demo")}
                className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-sm shadow-sky-500/25 transition-all flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Try Demo Roles</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
