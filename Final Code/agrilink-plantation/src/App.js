// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 🌱 Auth & Entry
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileSetup from "./pages/ProfileSetup";

// 🏠 Main & Management
import Dashboard from "./pages/Dashboard";

// 🌾 Crops (Harvests)
import HarvestList from "./pages/HarvestList";
import AddHarvest from "./pages/AddHarvest";
import HarvestDetails from "./pages/HarvestDetails";

// 🤝 Deals
import DealRequest from "./pages/DealRequest";
import DealDetails from "./pages/DealDetails";
import ConfirmedDeals from "./pages/ConfirmedDeals";

// 👷 Worker Management
import ManageWorkers from "./pages/ManageWorkers"; // ✅ Corrected import

// 📊 Reports / 🔔 Notifications
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 🌿 Entry & Auth */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />

        {/* 🏠 Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 🌾 Harvest Management */}
        <Route path="/harvests" element={<Navigate to="/harvests/list" replace />} />
        <Route path="/harvests/list" element={<HarvestList />} />
        <Route path="/harvests/add" element={<AddHarvest />} />
        <Route path="/harvests/:id" element={<HarvestDetails />} />

        {/* 🤝 Deals */}
        <Route path="/deals" element={<Navigate to="/deals/requests" replace />} />
        <Route path="/deals/requests" element={<DealRequest />} />
        <Route path="/deals/confirmed" element={<ConfirmedDeals />} />
        <Route path="/deals/:id" element={<DealDetails />} />

        {/* 📊 Reports / 🔔 Notifications / 👤 Profile / 👷 Manage Workers */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<ProfileSetup />} /> {/* ✅ Profile route */}
        <Route path="/manage-workers" element={<ManageWorkers />} /> {/* ✅ Correct worker route */}

        {/* 🚫 404 Fallback */}
        <Route
          path="*"
          element={<h2 className="p-6 text-center">404 — Page Not Found</h2>}
        />
      </Routes>
    </Router>
  );
}
