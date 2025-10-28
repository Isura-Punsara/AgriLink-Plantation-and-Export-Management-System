import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Deals from "./pages/Deals";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Shipments from "./pages/Shipments";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";       // ✅ add this if missing
import Plantations from "./pages/Plantations"; // ✅ add this if missing
import PendingDeals from "./pages/PendingDeals";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/shipments" element={<Shipments />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />          {/* ✅ add */}
        <Route path="/plantations" element={<Plantations />} />  {/* ✅ add */}
        <Route path="/pending-deals" element={<PendingDeals />} />
      </Routes>
    </Router>
  );
}

export default App;
