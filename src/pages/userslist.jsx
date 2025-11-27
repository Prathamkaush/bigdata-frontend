import { useState, useEffect } from "react";
import { Search, Shield, KeyRound, CircleDot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader/loader.jsx";
import api from "../api/admin.js";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const perPage = 8;

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v1/admin/users");
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => setLoading(false), 300);
  };

  // 🔍 FILTERING
  let filtered = [...users];

  if (search.trim()) {
    filtered = filtered.filter((u) =>
      u.username.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (roleFilter !== "all") {
    filtered = filtered.filter((u) => u.role === roleFilter);
  }

  if (statusFilter !== "all") {
    filtered = filtered.filter((u) => u.status === statusFilter);
  }

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // 🎨 BADGES
  const badgeColor = {
    admin: "bg-red-600/20 text-red-400 border border-red-800",
    sub_admin: "bg-blue-600/20 text-blue-300 border border-blue-700",
    user: "bg-gray-600/20 text-gray-300 border border-gray-700",
  };

  const statusColor = (s) =>
    s === "active" ? "text-green-400" : "text-red-400";

  const creditColor = (c) => {
    if (c < 50) return "text-red-400";
    if (c < 500) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun">

        {/* FILTER BAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              placeholder="Search username..."
              className="w-full pl-10 p-3 rounded-lg bg-black/40 border border-metallic-gun text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Role */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-3 rounded-lg bg-black/40 border border-metallic-gun text-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="sub_admin">Sub Admin</option>
            <option value="user">User</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 rounded-lg bg-black/40 border border-metallic-gun text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-metallic-gun">
                <th className="py-2">Username</th>
                <th className="py-2">Role</th>
                <th className="py-2">Credits</th>
                <th className="py-2">Status</th>
                <th className="py-2">API Key</th>
                <th className="py-2">Created</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3"><div className="h-4 bg-gray-700 w-20 rounded"></div></td>
                    <td className="py-3"><div className="h-4 bg-gray-700 w-14 rounded"></div></td>
                    <td className="py-3"><div className="h-4 bg-gray-700 w-10 rounded"></div></td>
                    <td className="py-3"><div className="h-4 bg-gray-700 w-12 rounded"></div></td>
                    <td className="py-3"><div className="h-4 bg-gray-700 w-16 rounded"></div></td>
                    <td className="py-3"><div className="h-4 bg-gray-700 w-24 rounded"></div></td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                paginated.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-metallic-gun/40 hover:bg-black/20 cursor-pointer"
                    onClick={() => navigate(`/users/${u.id}`)}
                  >
                    {/* Username */}
                    <td className="py-2 text-white font-semibold">{u.username}</td>

                    {/* Role */}
                    <td className="py-2">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${badgeColor[u.role]}`}
                      >
                        {u.role.replace("_", " ")}
                      </span>
                    </td>

                    {/* Credits */}
                    <td className={`py-2 font-semibold ${creditColor(u.credits)}`}>
                      {u.credits}
                    </td>

                    {/* Status */}
                    <td className={`py-2 capitalize ${statusColor(u.status)}`}>
                      {u.status}
                    </td>

                    {/* API Key */}
                    <td className="py-2">
                      <div className="flex items-center gap-1 text-gray-300">
                        <KeyRound size={14} />
                        <span className="blur-sm hover:blur-none">{u.api_key}</span>
                      </div>
                    </td>

                    {/* Created */}
                    <td className="py-2 text-gray-400">
                      {new Date(u.created_at).toLocaleString()}
                    </td>

                    {/* VIEW */}
                    <td className="py-2 text-accent font-semibold">View →</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-metallic-dark border border-metallic-gun rounded-lg disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-gray-300">Page {page} / {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-metallic-dark border border-metallic-gun rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
