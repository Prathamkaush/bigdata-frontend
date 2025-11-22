import {
  LayoutDashboard,
  Users,
  CreditCard,
  List,
  BarChart3,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
  { name: "Users", icon: <Users size={20} />, path: "/users" },
  { name: "Credits", icon: <CreditCard size={20} />, path: "/credits" },
  { name: "Logs", icon: <List size={20} />, path: "/logs" },
  { name: "Stats", icon: <BarChart3 size={20} />, path: "/stats" },
  { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
];

export default function Sidebar() {
    
    const logout = () => {
  localStorage.removeItem("admin_api_key");
  window.location.href = "/login";
};

  return (
    <div className="w-64 bg-metallic-plate border-r border-metallic-gun flex flex-col px-4 py-6">
      
      {/* Logo */}
      <h1 className="text-2xl font-bold mb-10 text-accent">
        BigData Admin
      </h1>

      {/* Menu */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm 
              transition 
              ${
                isActive
                  ? "bg-accent text-black font-semibold"
                  : "text-gray-300 hover:bg-metallic-dark hover:text-accent"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
        <button
  onClick={logout}
  className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
>
  Logout
</button>

      </nav>
    </div>
  );
}
