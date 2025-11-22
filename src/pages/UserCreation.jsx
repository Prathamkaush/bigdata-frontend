import { useState, useEffect } from "react";
import api from "../api/admin.js";
import { Search, UserPlus } from "lucide-react";
import Loader from "../components/Loader/loader.jsx"; // full-page loader

export default function Users() {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true); // shimmer loader
  const [creating, setCreating] = useState(false); // loader for create user

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v1/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users", err);
    }
    setTimeout(() => setLoading(false), 300);
  };

  const createUser = async () => {
    if (!name.trim()) return;

    setCreating(true);

    try {
      const res = await api.post("/v1/admin/create-user", { name });
      alert(`User created!\nAPI Key: ${res.data.api_key}`);
      setName("");
      loadUsers();
    } catch (err) {
      console.error("Error creating user", err);
    }

    setCreating(false);
  };

  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase()?.includes(filter.toLowerCase())
  );

  return (
    <div className="relative space-y-8 px-2">

      {/* FULL PAGE LOADER WHEN CREATING USER */}
      {creating && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      <h1 className="text-2xl font-bold tracking-wide">Manage Users</h1>

      {/* ===========================================
          CREATE USER BOX (with shimmer)
      ============================================ */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun max-w-xl mx-auto shadow-md">

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-36 bg-gray-700 rounded"></div>
            <div className="h-10 w-full bg-gray-700 rounded"></div>
            <div className="h-10 w-28 bg-gray-700 rounded"></div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="text-accent" size={20} /> Create User
            </h2>

            <input
              type="text"
              placeholder="Enter user name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/40 border border-metallic-gun text-white focus:outline-none focus:ring-1 focus:ring-accent"
            />

            <button
              onClick={createUser}
              className="mt-4 bg-accent text-black font-semibold px-5 py-2 rounded-lg hover:bg-accent/80 transition"
            >
              Create
            </button>
          </>
        )}
      </div>

      {/* ===========================================
          USERS TABLE (with shimmer)
      ============================================ */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun shadow-md">

        {/* Search Bar */}
        {loading ? (
          <div className="animate-pulse mb-4">
            <div className="h-10 bg-gray-700 rounded w-full"></div>
          </div>
        ) : (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 p-3 rounded-lg bg-black/40 border border-metallic-gun text-white focus:outline-none"
            />
          </div>
        )}

        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-metallic-gun">
              <th className="py-2">User</th>
              <th className="py-2">User ID</th>
              <th className="py-2">API Key (Hidden)</th>
              <th className="py-2">Created At</th>
            </tr>
          </thead>

          <tbody>
            {loading
              ? [...Array(8)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3">
                      <div className="h-4 bg-gray-700 rounded w-28"></div>
                    </td>
                    <td className="py-3">
                      <div className="h-4 bg-gray-700 rounded w-16"></div>
                    </td>
                    <td className="py-3">
                      <div className="h-4 bg-gray-700 rounded w-32"></div>
                    </td>
                    <td className="py-3">
                      <div className="h-4 bg-gray-700 rounded w-40"></div>
                    </td>
                  </tr>
                ))
              : filteredUsers.length === 0
              ? (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
                )
              : filteredUsers.map((u, i) => (
                  <tr
                    key={i}
                    className="text-white border-b border-metallic-gun/50 hover:bg-black/20 transition"
                  >
                    <td className="py-2">{u.username}</td>
                    <td className="py-2">{u.id}</td>
                    <td className="py-2 text-gray-500">••••••••••••</td>
                    <td className="py-2">
                      {new Date(u.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
