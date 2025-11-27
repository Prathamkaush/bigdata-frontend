// src/components/Sidebar.jsx
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserPlus,
  List,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
  MessageSquare,
  Database,
  Shield,
  KeyRound
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const location = useLocation();
  const role = localStorage.getItem("admin_role") || "sub_admin";
  const username = localStorage.getItem("admin_username") || "User";

  const [mobileOpen, setMobileOpen] = useState(false);

  // Route detection
  const isUsersRoute = location.pathname.startsWith("/users");
  const isRolesRoute = location.pathname.startsWith("/roles");
  const isCreditsRoute = location.pathname.startsWith("/credits");

  const [openUsers, setOpenUsers] = useState(isUsersRoute);
  const [openRoles, setOpenRoles] = useState(isRolesRoute);
  const [openCredits, setOpenCredits] = useState(isCreditsRoute);

  useEffect(() => setOpenUsers(isUsersRoute), [isUsersRoute]);
  useEffect(() => setOpenRoles(isRolesRoute), [isRolesRoute]);
  useEffect(() => setOpenCredits(isCreditsRoute), [isCreditsRoute]);

  const logout = () => {
    localStorage.removeItem("admin_api_key");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_username");
    window.location.href = "/login";
  };

  const parentActive = "bg-accent/20 text-accent border border-accent rounded-md";
  const parentInactive = "text-gray-300 hover:text-accent rounded-md";

  const childActive = "text-accent font-semibold";
  const childInactive = "text-gray-400 hover:text-accent";

  return (
    <>
      {/* Mobile button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-metallic-plate p-2 rounded-lg border border-metallic-gun"
      >
        <Menu size={24} className="text-accent" />
      </button>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-metallic-plate border-r border-metallic-gun flex flex-col px-4 py-6 z-50 transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-64 md:translate-x-0"}
        `}
      >

        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden absolute top-4 right-4 bg-metallic-dark p-2 rounded"
        >
          <X size={22} className="text-accent" />
        </button>

        <h1 className="text-2xl font-bold mb-10 text-accent">BigData Admin</h1>

        <nav className="space-y-2 flex-1">
          
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm ${isActive ? parentActive : parentInactive}`
            }
          >
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>

          {/* USERS MODULE */}
          <div>
            <button
              onClick={() => setOpenUsers(!openUsers)}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm ${
                isUsersRoute ? parentActive : parentInactive
              }`}
            >
              <span className="flex items-center gap-3">
                <Users size={20} /> Users
              </span>
              {openUsers ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {openUsers && (
              <div className="ml-6 mt-2 space-y-1">

                {/* Admin Only */}
                {role === "admin" && (
                  <NavLink
                    to="/users/create"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2 py-1 text-sm ${isActive ? childActive : childInactive}`
                    }
                  >
                    <UserPlus size={16} /> Create User
                  </NavLink>
                )}

                <NavLink
                  to="/users/list"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-2 py-1 text-sm ${isActive ? childActive : childInactive}`
                  }
                >
                  <List size={16} /> Users List
                </NavLink>

                <NavLink
                  to="/records"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-2 py-1 text-sm ${isActive ? childActive : childInactive}`
                  }
                >
                  <Database size={16} /> User Records
                </NavLink>
              </div>
            )}
          </div>

          {/* ROLE MANAGEMENT (ADMIN ONLY) */}
          {role === "admin" && (
            <div>
              <button
                onClick={() => setOpenRoles(!openRoles)}
                className={`flex w-full items-center justify-between px-3 py-2 text-sm ${
                  isRolesRoute ? parentActive : parentInactive
                }`}
              >
                <span className="flex items-center gap-3">
                  <Shield size={20} /> Roles & Permissions
                </span>
                {openRoles ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {openRoles && (
                <div className="ml-6 mt-2 space-y-1">
                  <NavLink
                    to="/roles/list"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2 py-1 text-sm ${isActive ? childActive : childInactive}`
                    }
                  >
                    <List size={16} /> Admin / Sub Admin List
                  </NavLink>

                  <NavLink
                    to="/roles/permissions"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2 py-1 text-sm ${isActive ? childActive : childInactive}`
                    }
                  >
                    <KeyRound size={16} /> Permissions Matrix
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* CREDITS */}
          <div>
            <button
              onClick={() => setOpenCredits(!openCredits)}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm ${
                isCreditsRoute ? parentActive : parentInactive
              }`}
            >
              <span className="flex items-center gap-3">
                <CreditCard size={20} /> Credits
              </span>
              {openCredits ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {openCredits && (
              <div className="ml-6 mt-2 space-y-1">

                {role === "admin" && (
                  <NavLink
                    to="/credits/add"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2 py-1 text-sm ${isActive ? childActive : childInactive}`
                    }
                  >
                    <UserPlus size={16} /> Add Credits
                  </NavLink>
                )}

                {role === "admin" && (
                  <NavLink
                    to="/credits/manage"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2 py-1 text-sm ${isActive ? childActive : childInactive}`
                    }
                  >
                    <List size={16} /> Manage Credits
                  </NavLink>
                )}
              </div>
            )}
          </div>

          {/* LOGS */}
          <NavLink
            to="/logs"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm ${isActive ? parentActive : parentInactive}`
            }
          >
            <List size={20} /> Logs
          </NavLink>

          {/* STATS */}
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm ${isActive ? parentActive : parentInactive}`
            }
          >
            <BarChart3 size={20} /> Stats
          </NavLink>

          {/* FEEDBACK */}
          <NavLink
            to="/feedback"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm ${isActive ? parentActive : parentInactive}`
            }
          >
            <MessageSquare size={20} /> Feedback
          </NavLink>

          {/* SETTINGS → ADMIN ONLY */}
          {role === "admin" && (
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm ${isActive ? parentActive : parentInactive}`
              }
            >
              <Settings size={20} /> Settings
            </NavLink>
          )}
        </nav>

        {/* USER FOOTER */}
        <div className="bg-black/30 border border-metallic-gun p-3 rounded-lg mb-4">
          <div className="text-accent font-semibold">{username}</div>
          <div
            className={`text-xs mt-1 px-2 py-1 rounded w-fit ${
              role === "admin" ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            {role.toUpperCase()}
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </>
  );
}
