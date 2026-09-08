import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { MOCK_PERSONAS } from "../../data/mockClubs";
import { X, Sparkles, LogIn, UserPlus, Shield, CheckCircle2, ArrowRight } from "lucide-react";

export function AuthModal() {
  const { authModalOpen, authModalTab, setAuthModalTab, closeAuthModal, login, register, switchPersona } = useAuth();
  
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

  if (!authModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || "Invalid credentials. Try using one of the 1-Click Demo accounts.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(regData);
    } catch (err) {
      setError(err.message || "Registration failed. Please check your fields.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectPersona = async (role) => {
    setSubmitting(true);
    try {
      await switchPersona(role);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Sky Header Banner */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Sparkles className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">ClubConnect Access</h2>
              <p className="text-xs text-sky-100 font-medium">Institutional Ecosystem & Role Governance</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-sky-50/50 p-1.5">
          <button
            onClick={() => { setAuthModalTab("demo"); setError(""); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              authModalTab === "demo"
                ? "bg-white text-sky-600 shadow-sm border border-sky-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>1-Click Personas</span>
          </button>
          <button
            onClick={() => { setAuthModalTab("login"); setError(""); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              authModalTab === "login"
                ? "bg-white text-sky-600 shadow-sm border border-sky-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => { setAuthModalTab("register"); setError(""); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              authModalTab === "register"
                ? "bg-white text-sky-600 shadow-sm border border-sky-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Student</span>
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
                Select any institutional role to instantly experience their permissions and dedicated dashboard:
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
                      <span>Switch to Persona</span>
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
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Institutional Email or Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. alex.student@campus.edu or alex_student"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
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
                className="w-full mt-2 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm shadow-md shadow-sky-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{submitting ? "Authenticating..." : "Sign In to Campus ID"}</span>
              </button>
              <div className="pt-2 text-center text-xs text-slate-500">
                Want quick testing?{" "}
                <button
                  type="button"
                  onClick={() => setAuthModalTab("demo")}
                  className="text-sky-600 font-semibold hover:underline"
                >
                  Use 1-Click Demo Personas
                </button>
              </div>
            </form>
          )}

          {/* Registration Form */}
          {authModalTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Email</label>
                <input
                  type="email"
                  required
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  placeholder="jane.doe@campus.edu"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID</label>
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
                className="w-full mt-2 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm shadow-md shadow-sky-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{submitting ? "Creating Account..." : "Create Student Account"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
