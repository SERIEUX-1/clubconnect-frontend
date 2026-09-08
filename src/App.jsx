import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NavBar } from "./components/layout/NavBar";
import { AuthModal } from "./components/auth/AuthModal";

// Public pages
import { DiscoverClubs } from "./pages/DiscoverClubs";
import { ClubPortfolio } from "./pages/ClubPortfolio";

// Role dashboards
import { StudentDashboard } from "./pages/StudentDashboard";
import { LeaderDashboard } from "./pages/LeaderDashboard";
import { CommitteeDashboard } from "./pages/CommitteeDashboard";
import { CommitteeCommandCenter } from "./pages/CommitteeCommandCenter";
import { DeanDashboard } from "./pages/DeanDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { CCEARevealMode } from "./pages/CCEARevealMode";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#f4f8fd]">
        <NavBar />
        <AuthModal />
        <Routes>
          {/* Public */}
          <Route path="/" element={<DiscoverClubs />} />
          <Route path="/clubs/:clubId" element={<ClubPortfolio />} />

          {/* Role dashboards */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/leader-dashboard" element={<LeaderDashboard />} />
          <Route path="/committee-dashboard" element={<CommitteeDashboard />} />
          <Route path="/command-center" element={<CommitteeCommandCenter />} />
          <Route path="/ccea-reveal" element={<CCEARevealMode />} />
          <Route path="/dean-dashboard" element={<DeanDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
