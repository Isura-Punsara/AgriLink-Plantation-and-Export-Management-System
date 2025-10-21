import { LayoutDashboard, Leaf, BarChart2, Bell, User, LogOut } from "lucide-react"; 
import { NavLink } from "react-router-dom"; 
 
export default function Sidebar() { 
  const menuItems = [ 
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, link: "/dashboard" }, 
    { name: "Plantations", icon: <Leaf size={18} />, link: "/plantations" }, 
    { name: "Deals", icon: <BarChart2 size={18} />, link: "/deals" }, 
    { name: "Reports", icon: <BarChart2 size={18} />, link: "/reports" }, 
    { name: "Notifications", icon: <Bell size={18} />, link: "/notifications" }, 
    { name: "Profile", icon: <User size={18} />, link: "/profile" }, 
  ]; 
 
  return ( 
    <aside className="w-64 bg-white shadow-md h-screen p-4 flex flex-col justify-between"> 
      <div> 
        <h1 className="text-2xl font-semibold text-blue-700 mb-6">AgriLink Exporter</h1> 
        <nav className="space-y-2"> 
          {menuItems.map((item) => ( 
            <NavLink 
              key={item.name} 
              to={item.link} 
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${ 
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-blue-50" 
                }` 
              } 
            > 
              {item.icon} 
              {item.name} 
            </NavLink> 
          ))} 
        </nav> 
      </div> 
      <button className="flex items-center gap-2 text-red-500 hover:text-red-700 mt-4"> 
        <LogOut size={18} /> Logout 
      </button> 
    </aside> 
  ); 
} 
