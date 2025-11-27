// src/pages/roles/RolesList.jsx
import { useEffect, useState } from "react";
import api from "../api/admin";
import { Shield, Search } from "lucide-react";

export default function RolesList() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v1/admin/users"); // same endpoint
      const roles = res.data.filter((u) => u.role === "admin" || u.role === "sub_admin");
      setUsers(roles);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  let filtered = [...users];

  if (filter.trim()) {
    filtered = filtered.filter((u) =>
      u.username.toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (roleFilter !== "all") {
    filtered = filtered.filter((u) => u.role === roleFilter);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin & Sub Admins</h1>

      {/* Filters */}
      <div className="bg-metallic-plate p-4 rounded-xl border border-metallic-gun flex flex-wrap gap-4">

        <div className="flex items-center bg-black/40 p-3 rounded border border-metallic-gun flex-1">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            placeholder="Search by username..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent flex-1 text-white outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-3 bg-black/40 border border-metallic-gun text-white rounded"
        >
          <option value="all">All</option>
          <option value="admin">Admins</option>
          <option value="sub_admin">Sub Admins</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-metallic-gun text-sm">
              <th className="py-2">User</th>
              <th className="py-2">Role</th>
              <th className="py-2">Created</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td className="py-4 text-center text-gray-400" colSpan="3">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="3" className="py-4 text-center text-gray-400">No roles found.</td></tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="text-white border-b border-metallic-gun/50">
                  <td className="py-2 flex items-center gap-2">
                    <Shield size={16} className="text-accent" /> {u.username}
                  </td>
                  <td className="py-2 capitalize">{u.role.replace("_", " ")}</td>
                  <td className="py-2">
                    {new Date(u.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
