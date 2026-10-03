import { lazy, Suspense, useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { I18nProvider } from "./i18n/I18nProvider";
import { api } from "./lib/api";
import { SkyCanvas, EternalSun } from "./components/layout/SkyCanvas";
import { ErrorBoundary } from "./components/layout/ErrorBoundary";
import { NavBar } from "./components/layout/NavBar";
import { AuthModal } from "./components/auth/AuthModal";
import { LicenceRequestModal } from "./components/brand/LicenceRequestModal";
import { RequireAuth } from "./components/auth/RequireAuth";
import { RequireRole } from "./components/auth/RequireRole";
import { ClubConnectCopilot } from "./components/copilot/ClubConnectCopilot";

import { HomePage } from "./pages/HomePage";
import { DiscoverClubs } from "./pages/DiscoverClubs";
import { ClubPortfolio } from "./pages/ClubPortfolio";
import { StudentDashboard } from "./pages/StudentDashboard";
import { LeaderDashboard } from "./pages/LeaderDashboard";
import { CommitteeDashboard } from "./pages/CommitteeDashboard";
import { CommitteeCommandCenter } from "./pages/CommitteeCommandCenter";
import { DeanDashboard } from "./pages/DeanDashboard";
import { CCEARevealMode } from "./pages/CCEARevealMode";
import { HelpCenter } from "./pages/HelpCenter";
import { HallOfExcellence } from "./pages/HallOfExcellence";
import { TrustAndPrivacy } from "./pages/TrustAndPrivacy";
import { MembershipLedger } from "./pages/MembershipLedger";

const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard").then((m) => ({ default: m.AdminDashboard }))
);

function I18nShell({ children }) {
  const { user } = useAuth();
  const persist = useCallback(
    (code) => {
      if (user) api.auth.setLanguage(code);
    },
    [user]
  );
  return (
    <I18nProvider userLanguage={user?.preferred_language} onPersist={persist}>
      {children}
    </I18nProvider>
  );
}

function LicenceGate() {
  const { licenceModalOpen, closeLicenceModal } = useAuth();
  return <LicenceRequestModal open={licenceModalOpen} onClose={closeLicenceModal} />;
}

export default function App() {
  return (
    <AuthProvider>
      <I18nShell>
      <ToastProvider>
        <div className="relative min-h-screen">
          <SkyCanvas />
          <EternalSun />
          <div className="relative z-20">
          <ErrorBoundary>
          <NavBar />
          <AuthModal />
          <LicenceGate />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/trust" element={<TrustAndPrivacy />} />
            <Route
              path="/clubs"
              element={
                <RequireAuth>
                  <DiscoverClubs />
                </RequireAuth>
              }
            />
            <Route
              path="/clubs/:clubId"
              element={
                <RequireAuth>
                  <ClubPortfolio />
                </RequireAuth>
              }
            />

            <Route
              path="/hall-of-excellence"
              element={
                <RequireAuth>
                  <HallOfExcellence />
                </RequireAuth>
              }
            />

            <Route
              path="/student-dashboard"
              element={
                <RequireRole path="/student-dashboard">
                  <StudentDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/leader-dashboard"
              element={
                <RequireRole path="/leader-dashboard">
                  <LeaderDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/committee-dashboard"
              element={
                <RequireRole path="/committee-dashboard">
                  <CommitteeDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/command-center"
              element={
                <RequireRole path="/command-center">
                  <CommitteeCommandCenter />
                </RequireRole>
              }
            />
            <Route
              path="/ccea-reveal"
              element={
                <RequireRole path="/ccea-reveal">
                  <CCEARevealMode />
                </RequireRole>
              }
            />
            <Route
              path="/membership-ledger"
              element={
                <RequireRole path="/membership-ledger">
                  <MembershipLedger />
                </RequireRole>
              }
            />
            <Route
              path="/staff-dashboard"
              element={
                <RequireRole path="/staff-dashboard">
                  <DeanDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/dean-dashboard"
              element={
                <RequireRole path="/dean-dashboard">
                  <DeanDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <RequireRole path="/admin-dashboard">
                  <Suspense
                    fallback={
                      <div className="px-6 py-24 text-center text-sm font-medium text-slate-800">
                        Loading campus admin…
                      </div>
                    }
                  >
                    <AdminDashboard />
                  </Suspense>
                </RequireRole>
              }
            />
          </Routes>
          <ClubConnectCopilot />
          </ErrorBoundary>
          </div>
        </div>
      </ToastProvider>
      </I18nShell>
    </AuthProvider>
  );
}
