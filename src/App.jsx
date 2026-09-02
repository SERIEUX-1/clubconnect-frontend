import { Route, Routes } from "react-router-dom";
import { NavBar } from "./components/layout/NavBar";
import { ClubPortfolio } from "./pages/ClubPortfolio";
import { CommitteeCommandCenter } from "./pages/CommitteeCommandCenter";
import { DiscoverClubs } from "./pages/DiscoverClubs";

export default function App() {
  return (
    <div className="min-h-screen bg-fog">
      <NavBar />
      <Routes>
        <Route path="/" element={<DiscoverClubs />} />
        <Route path="/clubs/:clubId" element={<ClubPortfolio />} />
        <Route path="/command-center" element={<CommitteeCommandCenter />} />
      </Routes>
    </div>
  );
}
