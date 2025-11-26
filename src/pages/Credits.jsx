// src/pages/Credits.jsx
import { useEffect, useState } from "react";
import api from "../api/admin.js";
import { Search, UserPlus, Plus } from "lucide-react";
import Loader from "../components/Loader/loader.jsx";

export default function Credits() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [credits, setCredits] = useState("");

  const [suggestOpen, setSuggestOpen] = useState(false);

  // table filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [creditSort, setCreditSort] = useState("none");

  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v1/admin/users");
      setUsers(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.log("Error loading users", err);
    }
    setTimeout(() => setLoading(false), 300);
  };

  // -------------------------------------------------
  // HANDLE ADD CREDITS
  // -------------------------------------------------
  const handleAddCredits = async () => {
    if (!userId) return alert("❌ Select a valid user from suggestions!");
    if (!credits || Number(credits) <= 0)
      return alert("❌ Credits must be a positive number");

    try {
      await api.post("/v1/admin/add-credits", {
        user_id: userId,
        credits: Number(credits),
      });

      alert("⭐ Credits added successfully!");

      setUsername("");
      setUserId(null);
      setCredits("");

      loadUsers();
    } catch (err) {
      console.log("Error adding credits", err);
      alert("❌ Failed to add credits");
    }
  };

  // -------------------------------------------------
  // FILTERING + SORTING
  // -------------------------------------------------
  useEffect(() => {
    let data = [...users];

    if (search.trim()) {
      data = data.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      data = data.filter((u) => u.role === roleFilter);
    }

    if (creditSort === "asc") {
      data.sort((a, b) => a.credits - b.credits);
    } else if (creditSort === "desc") {
      data.sort((a, b) => b.credits - a.credits);
    }

    setFiltered(data);
    setPage(1);
  }, [search, roleFilter, creditSort, users]);

  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  // -------------------------------------------------
  // SUGGESTIONS
  // -------------------------------------------------
  const suggestions =
    username.length > 0
      ? users
          .filter((u) =>
            u.username.toLowerCase().includes(username.toLowerCase())
          )
          .slice(0, 6)
      : [];

  const roleColor = (role) => {
    if (role === "admin") return "text-red-400";
    if (role === "sub_admin") return "text-yellow-300";
    return "text-blue-300";
  };

  return (
    <div className="space-y-10 px-2 md:px-6">
      <h1 className="text-2xl font-bold">Manage Credits</h1>

      {/* ------------------------------------------------- */}
      {/* ADD CREDITS FORM */}
      {/* ------------------------------------------------- */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun max-w-xl mx-auto shadow-lg">

        {/* USERNAME INPUT */}
        <label>User Name</label>
        <div className="relative mt-2">
          <div className="flex items-center gap-2 bg-black/40 p-3 rounded border border-metallic-gun">
            <UserPlus size={18} className="text-gray-400" />
            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setSuggestOpen(true);
              }}
              placeholder="Type username..."
              className="bg-transparent flex-1 text-white outline-none"
            />
          </div>

          {/* SUGGESTION DROPDOWN */}
          {suggestOpen && username && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-14 bg-metallic-dark border border-metallic-gun rounded max-h-48 overflow-y-auto z-50 shadow-xl">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setUsername(s.username);
                    setUserId(s.id);
                    setSuggestOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-metallic-plate cursor-pointer flex justify-between"
                >
                  <span>{s.username}</span>
                  <span className={`text-xs ${roleColor(s.role)}`}>
                    {s.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CREDITS INPUT */}
        <label className="mt-4 block">Credits</label>
        <div className="flex items-center gap-2 mt-2 bg-black/40 p-3 rounded border border-metallic-gun">
          <Plus size={18} className="text-gray-400" />
          <input
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            placeholder="Enter credits..."
            type="number"
            className="bg-transparent flex-1 text-white outline-none"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleAddCredits}
          className="mt-5 w-full bg-accent text-black px-5 py-2 rounded-lg font-semibold hover:bg-accent/80 transition"
        >
          Add Credits
        </button>
      </div>

      {/* ------------------------------------------------- */}
      {/* USER TABLE */}
      {/* ------------------------------------------------- */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun shadow-lg">

        {/* TABLE FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-5">

          {/* SEARCH */}
          <div className="flex items-center bg-black/40 p-2 rounded border border-metallic-gun flex-1">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="bg-transparent text-white outline-none flex-1"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* ROLE FILTER */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-2 bg-black/40 border border-metallic-gun text-white rounded"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="sub_admin">Sub Admin</option>
              <option value="user">User</option>
            </select>

            {/* CREDITS SORT */}
            <select
              value={creditSort}
              onChange={(e) => setCreditSort(e.target.value)}
              className="p-2 bg-black/40 border border-metallic-gun text-white rounded"
            >
              <option value="none">Sort Credits</option>
              <option value="asc">Low → High</option>
              <option value="desc">High → Low</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-metallic-gun">
              <tr>
                <th className="p-3 border border-metallic-gun">ID</th>
                <th className="p-3 border border-metallic-gun">Username</th>
                <th className="p-3 border border-metallic-gun">Role</th>
                <th className="p-3 border border-metallic-gun">Credits</th>
                <th className="p-3 border border-metallic-gun">Created At</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4 bg-black/20 rounded"></td>
                    <td className="p-4 bg-black/20 rounded"></td>
                    <td className="p-4 bg-black/20 rounded"></td>
                    <td className="p-4 bg-black/20 rounded"></td>
                    <td className="p-4 bg-black/20 rounded"></td>
                  </tr>
                ))
              ) : (
                paginated.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-metallic-gun/50 hover:bg-black/20 transition"
                  >
                    <td className="p-3">{u.id}</td>
                    <td className="p-3">{u.username}</td>
                    <td className={`p-3 capitalize ${roleColor(u.role)}`}>
                      {u.role}
                    </td>
                    <td className="p-3">{u.credits}</td>
                    <td className="p-3">
                      {new Date(u.created_at).toLocaleString("en-IN", {
                        hour12: true,
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-metallic-gun text-gray-300 rounded disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-gray-300">Page {page} of {totalPages}</span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-metallic-gun text-gray-300 rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
