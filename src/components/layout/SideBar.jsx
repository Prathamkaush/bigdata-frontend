import {
  LayoutDashboard,
  Users,
  CreditCard,
  List,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
  { name: "Users", icon: <Users size={20} />, path: "/users" },
  { name: "Credits", icon: <CreditCard size={20} />, path: "/credits" },
  { name: "Logs", icon: <List size={20} />, path: "/logs" },
  { name: "Stats", icon: <BarChart3 size={20} />, path: "/stats" },
  { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("admin_api_key");
    window.location.href = "/login";
  };

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-metallic-plate p-2 rounded-lg border border-metallic-gun"
      >
        <Menu size={24} className="text-accent" />
      </button>

      {/* OVERLAY ON MOBILE */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full w-64 
          bg-metallic-plate border-r border-metallic-gun 
          flex flex-col px-4 py-6 z-50 transform 
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-64 md:translate-x-0"}
        `}
      >
        {/* CLOSE BUTTON ON MOBILE */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden absolute top-4 right-4 bg-metallic-dark p-2 rounded"
        >
          <X size={22} className="text-accent" />
        </button>

        {/* Logo */}
        <h1 className="text-2xl font-bold mb-10 text-accent">
          BigData Admin
        </h1>

        {/* Menu */}
        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
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
        </nav>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="mt-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </>
  );
}
