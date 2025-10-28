import { NavLink } from "react-router-dom";
import {
  Sprout,
  Home,
  Leaf,
  Handshake,
  BarChart3,
  Bell,
  User,
  Users,
} from "lucide-react";

export default function Sidebar({ role = "owner" }) {
  const linkBase =
    "flex items-center gap-3 px-4 py-2 rounded-xl transition-all";
  const linkClasses = ({ isActive }) =>
    `${linkBase} ${
      isActive
        ? "bg-green-600 text-white shadow-md"
        : "text-gray-700 hover:bg-green-50"
    }`;

  const isOwner = role === "owner";
  const isWorker = role === "worker";

  return (
    <aside className="hidden md:flex md:flex-col w-64 p-4 bg-gradient-to-b from-green-700 to-emerald-600 text-white min-h-screen sticky top-0">
      <div className="flex items-center gap-2 mb-6">
        <Sprout /> <span className="font-semibold text-lg">AgriLink</span>
      </div>

      <nav className="flex flex-col gap-2">
        <NavLink to="/dashboard" className={linkClasses}>
          <Home /> Dashboard
        </NavLink>

        <NavLink to="/harvests" className={linkClasses}>
          <Leaf /> Crops
        </NavLink>

        {isOwner && (
          <NavLink to="/deals" className={linkClasses}>
            <Handshake /> Deals
          </NavLink>
        )}

        {isOwner && (
          <NavLink to="/reports" className={linkClasses}>
            <BarChart3 /> Reports
          </NavLink>
        )}

        {/* Hide Notifications tab for workers */}
        {!isWorker && (
          <NavLink to="/notifications" className={linkClasses}>
            <Bell /> Notifications
          </NavLink>
        )}

        {isOwner && (
          <NavLink to="/manage-workers" className={linkClasses}>
            <Users /> Workers
          </NavLink>
        )}

        <NavLink to="/profile" className={linkClasses}>
          <User /> Profile
        </NavLink>
      </nav>

      <div className="mt-auto text-sm text-emerald-50/80">
        © {new Date().getFullYear()} AgriLink
      </div>
    </aside>
  );
}
