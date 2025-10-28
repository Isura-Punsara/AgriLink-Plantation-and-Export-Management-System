// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  Sprout,
  LayoutDashboard,
  Leaf,
  BarChart2,
  Bell,
  User,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const linkBase = "flex items-center gap-3 px-4 py-2 rounded-xl transition-all";
  const linkClasses = ({ isActive }) =>
    `${linkBase} ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-100 hover:bg-blue-500/30"
    }`;

  return (
    <aside className="hidden md:flex md:flex-col w-64 p-4 bg-gradient-to-b from-blue-800 to-blue-600 text-white min-h-screen sticky top-0">
      <div className="flex items-center gap-2 mb-6">
        <Sprout /> <span className="font-semibold text-lg">AgriLink Exporter</span>
      </div>

      <nav className="flex flex-col gap-2">
        <NavLink to="/dashboard" className={linkClasses}>
          <LayoutDashboard /> Dashboard
        </NavLink>
        <NavLink to="/plantations" className={linkClasses}>
          <Leaf /> Plantations
        </NavLink>
        <NavLink to="/deals" className={linkClasses}>
          <BarChart2 /> Deals
        </NavLink>
        <NavLink to="/reports" className={linkClasses}>
          <BarChart2 /> Reports
        </NavLink>
        <NavLink to="/notifications" className={linkClasses}>
          <Bell /> Notifications
        </NavLink>
        <NavLink to="/profile" className={linkClasses}>
          <User /> Profile
        </NavLink>
      </nav>

      <div className="mt-auto flex items-center gap-2 text-red-200 hover:text-red-400 cursor-pointer transition-all">
        <LogOut size={18} /> Logout
      </div>
    </aside>
  );
}
