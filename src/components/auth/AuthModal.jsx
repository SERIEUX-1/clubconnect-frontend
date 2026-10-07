import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MOCK_PERSONAS } from "../../data/mockClubs";
import { dashboardPathForRole } from "../../lib/roles";
import { X, Sparkles, LogIn, UserPlus, Shield, CheckCircle2, ArrowRight } from "lucide-react";
import { ClubConnectMark } from "../brand/ClubConnectLogo";
import { useI18n } from "../../i18n/I18nProvider";
import { api } from "../../lib/api";

export function AuthModal() {
  const { authModalOpen, authModalTab, setAuthModalTab, closeAuthModal, login, register, switchPersona, acceptSession } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);
  const [sso, setSso] = useState({ google: false, microsoft: false, note: "" });
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Register state
  const [regData, setRegData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    student_id: "",
    password: "",
  });

  useEffect(() => {
    if (!authModalOpen) return;
    api.auth.ssoStatus().then(setSso).catch(() => {});
  }, [authModalOpen]);

  useEffect(() => {
    if (!authModalOpen || authModalTab !== "login" || !sso.google || !sso.google_client_id) return;
    const existing = document.querySelector("script[data-cc-gsi]");
    const boot = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;
      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: sso.google_client_id,
        callback: async (response) => {
          setError("");
          setSubmitting(true);
          try {
            const res = await api.auth.ssoGoogle({ id_token: response.credential });
            const loggedIn = acceptSession(res);
            if (loggedIn?.role) navigate(dashboardPathForRole(loggedIn.role));
          } catch (err) {
            setError(err.message || t("auth.loginError"));
          } finally {
            setSubmitting(false);
          }
        },
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with",
      });
    };
    if (existing) {
      boot();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.dataset.ccGsi = "1";
    script.onload = boot;
    document.body.appendChild(script);
  }, [authModalOpen, authModalTab, sso.google, sso.google_client_id, acceptSession, navigate, t]);

  if (!authModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const loggedIn = await login(username, password);
      if (loggedIn?.role) navigate(dashboardPathForRole(loggedIn.role));
    } catch (err) {
      setError(err.message || t("auth.loginError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const created = await register(regData);
      navigate(dashboardPathForRole(created?.role || "student"));
    } catch (err) {
      setError(err.message || t("auth.registerError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectPersona = async (role) => {
    setSubmitting(true);
    setError("");
    try {
      await switchPersona(role);
      navigate(dashboardPathForRole(role));
    } catch (err) {
      setError(err.message || t("auth.demoError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101314]/30 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_40px_80px_-36px_rgba(16,19,20,0.45)]">
        {/* Sky Header Banner */}
        <div className="relative flex items-center justify-between border-b border-[#EEF0F5] px-6 pb-5 pt-6 text-[#101314]">
          <div className="flex items-center space-x-3">
            <ClubConnectMark size={40} />
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{t("auth.welcome")}</h2>
              <p className="text-xs font-medium text-[#5E6E81]">{t("auth.key")}</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="rounded-full p-1.5 text-[#5E6E81] transition-colors hover:bg-[#F3F5F8] hover:text-[#101314]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EEF0F5] bg-[#FBFBFD] p-1.5">
          <button
            onClick={() => { setAuthModalTab("demo"); setError(""); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              authModalTab === "demo"
                ? "bg-white text-[#101314] shadow-sm border border-[#E7EAF1]"
                : "text-[#5E6E81] hover:text-[#101314]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>{t("auth.personas")}</span>
          </button>
          <button
            onClick={() => { setAuthModalTab("login"); setError(""); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              authModalTab === "login"
                ? "bg-white text-[#101314] shadow-sm border border-[#E7EAF1]"
                : "text-[#5E6E81] hover:text-[#101314]"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t("auth.signIn")}</span>
          </button>
          <button
            onClick={() => { setAuthModalTab("register"); setError(""); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              authModalTab === "register"
                ? "bg-white text-[#101314] shadow-sm border border-[#E7EAF1]"
                : "text-[#5E6E81] hover:text-[#101314]"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t("auth.create")}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* 1-Click Demo Personas */}
          {authModalTab === "demo" && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 mb-2 font-medium">
                {t("auth.personasHint")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MOCK_PERSONAS.map((persona) => (
                  <button
                    key={persona.role}
                    type="button"
                    onClick={() => handleSelectPersona(persona.role)}
                    disabled={submitting}
                    className="text-left p-3.5 rounded-2xl border border-sky-100/90 bg-white hover:bg-sky-50/70 hover:border-sky-300 hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition-colors">
                        {persona.name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                        {persona.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
                      {persona.description}
                    </p>
                    <div className="flex items-center text-[11px] font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
                      <span>{t("auth.switchPersona")}</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Login Form */}
          {authModalTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-3 text-[11px] leading-relaxed text-slate-600">
                {sso.note || t("auth.ssoNote")}
              </div>
              {sso.google ? <div ref={googleBtnRef} className="flex justify-center" /> : (
                <button type="button" disabled className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-400">
                  {t("auth.googleOff")}
                </button>
              )}
              <button type="button" disabled className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-400">
                {t("auth.microsoftOff")}
              </button>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t("auth.email")}
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. you@alustudent.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t("auth.password")}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="sun-cta mt-2 flex w-full items-center justify-center space-x-2 rounded-xl py-2.5 text-sm font-semibold text-white"
              >
                <LogIn className="w-4 h-4" />
                <span>{submitting ? t("auth.signingIn") : t("auth.signInCampus")}</span>
              </button>
              <div className="pt-2 text-center text-xs text-slate-500">
                {t("auth.wantDemo")}{" "}
                <button
                  type="button"
                  onClick={() => setAuthModalTab("demo")}
                  className="text-sky-600 font-semibold hover:underline"
                >
                  {t("auth.useDemo")}
                </button>
              </div>
            </form>
          )}

          {/* Registration Form */}
          {authModalTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t("auth.firstName")}</label>
                  <input
                    type="text"
                    required
                    value={regData.first_name}
                    onChange={(e) => setRegData({ ...regData, first_name: e.target.value })}
                    placeholder="Jane"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t("auth.lastName")}</label>
                  <input
                    type="text"
                    required
                    value={regData.last_name}
                    onChange={(e) => setRegData({ ...regData, last_name: e.target.value })}
                    placeholder="Doe"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t("auth.licensedEmail")}</label>
                <input
                  type="email"
                  required
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  placeholder="you@student.yourcampus.edu"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  {t("auth.emailHint")}
                </p>
              </div>
              <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Campus or staff ID</label>
                <input
                  type="text"
                  required
                  value={regData.student_id}
                  onChange={(e) => setRegData({ ...regData, student_id: e.target.value })}
                  placeholder="STU-2026-XXXX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="sun-cta mt-2 flex w-full items-center justify-center space-x-2 rounded-xl py-2.5 text-sm font-semibold text-white"
              >
                <UserPlus className="w-4 h-4" />
                <span>{submitting ? "Creating Account..." : "Create account"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
