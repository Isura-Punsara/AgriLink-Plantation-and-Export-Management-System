import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileSetup from "./pages/ProfileSetup";
export default function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<Splash />} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="/profile-setup" element={<ProfileSetup />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="*" element={<Navigate to="/" replace />} />
</Routes>
</BrowserRouter>
);
}