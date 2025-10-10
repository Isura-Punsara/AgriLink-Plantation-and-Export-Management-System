import { NavLink } from "react-router-dom";
import { Sprout, Home, Leaf, Handshake, BarChart3, Bell, User } from "lucide-react";
export default function Sidebar() {
const linkBase = "flex items-center gap-3 px-4 py-2 rounded-xl transition-all";
const linkClasses = ({ isActive }) =>
`${linkBase} ${isActive ? "bg-green-600 text-white shadow-md" : "text-gray-700 hover:bg-gree
return