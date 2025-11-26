import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader/loader.jsx";
import api from "../api/admin.js";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortCredits, setSortCredits] = useState("none");

  const [page, setPage] = useState(1);
  const perPage = 10;

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

  // FILTERS
  let filtered = [...users];

  filtered = filtered.filter((u) =>
    u.username?.toLowerCase()?.includes(filter.toLowerCase())
  );

  if (roleFilter !== "all") {
    filtered = filtered.filter((u) => u.role === roleFilter);
  }

  // SORTING
  if (sortCredits === "low-high") {
    filtered.sort((a, b) => a.credits - b.credits);
  } else if (sortCredits === "high-low") {
    filtered.sort((a, b) => b.credits - a.credits);
  }

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // CREDIT COLOR
  const getCreditColor = (credits) => {
    if (credits < 50) return "text-red-400 font-bold";
    if (credits < 500) return "text-yellow-400 font-semibold";
    if (credits <= 1000) return "text-green-400 font-semibold";
    return "text-yellow-300 font-bold"; // premium accounts
  };

  // ROLE COLOR
  const roleBadge = (role) => {
    if (role === "admin")
      return "bg-red-600/20 text-red-400 border border-red-700";
    if (role === "sub_admin")
      return "bg-blue-600/20 text-blue-300 border border-blue-700";
    return "bg-gray-600/20 text-gray-300 border border-gray-700";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users List</h1>

      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun">

        {/* CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 p-3 rounded-lg bg-black/40 border border-metallic-gun text-white"
            />
          </div>

          {/* ROLE */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-metallic-gun text-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="sub_admin">Sub Admin</option>
            <option value="user">Regular User</option>
          </select>

          {/* SORT */}
          <select
            value={sortCredits}
            onChange={(e) => setSortCredits(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-metallic-gun text-white"
          >
            <option value="none">Sort by Credits</option>
            <option value="low-high">Low → High</option>
            <option value="high-low">High → Low</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-400 border-b border-metallic-gun">
                <th className="py-2">User</th>
                <th className="py-2">Role</th>
                <th className="py-2">Credits</th>
                <th className="py-2">Status</th>
                <th className="py-2">Created</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3"><div className="h-4 bg-gray-700 w-28 rounded"></div></td>
                    <td className="py-3"><div className="h-4 bg-gray-700 w-16 rounded"></div></td>
                    <td className="py-3"><div className="h-4 bg-gray-700 w-12 rounded"></div></td>
                    <td className="py-3"><div className="h-4 bg-gray-700 w-16 rounded"></div></td>
                    <td className="py-3"><div className="h-4 bg-gray-700 w-32 rounded"></div></td>
                    <td></td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-400">
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
                    <td className="py-2 text-white">{u.username}</td>

                    {/* Role */}
                    <td className="py-2">
                      <span className={`px-3 py-1 rounded-full text-xs ${roleBadge(u.role)}`}>
                        {u.role.replace("_", " ")}
                      </span>
                    </td>

                    {/* Credits */}
                    <td className={`py-2 ${getCreditColor(u.credits)}`}>
                      {u.credits}
                    </td>

                    {/* Status */}
                    <td className="py-2 capitalize">
                      {u.status === "active" ? (
                        <span className="text-green-400">Active</span>
                      ) : (
                        <span className="text-red-400">Disabled</span>
                      )}
                    </td>

                    {/* Created at */}
                    <td className="py-2">
                      {new Date(u.created_at).toLocaleString()}
                    </td>

                    {/* VIEW BUTTON */}
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

          <span className="text-gray-300">
            Page {page} / {totalPages}
          </span>

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
