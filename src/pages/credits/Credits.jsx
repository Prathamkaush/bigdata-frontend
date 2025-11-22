import { useEffect, useState } from "react";
import api from "../../api/admin.js";
import { Search, UserPlus, Plus } from "lucide-react";

export default function Credits() {
  const [username, setUsername] = useState("");
  const [credits, setCredits] = useState("");

  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [creditSort, setCreditSort] = useState("none");

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const rowsPerPage = 8;

  useEffect(() => {
    loadUsers();
  }, []);

  // ---------------------
  //   LOAD USERS
  // ---------------------
  const loadUsers = async () => {
    setLoading(true);

    try {
      const res = await api.get("/v1/admin/users");

      // small delay to prevent shimmer flicker
      setTimeout(() => {
        setUsers(res.data);
        setFiltered(res.data);
        setLoading(false);
      }, 300);
    } catch (err) {
      console.log("Error loading users", err);
      setLoading(false);
    }
  };

  // ---------------------
  //   ADD CREDITS
  // ---------------------
  const handleAddCredits = async () => {
    if (!username || !credits) return alert("Fill all fields");

    try {
      await api.post("/v1/admin/add-credits", {
        username: username,
        credits: Number(credits),
      });

      alert("Credits added successfully!");
      setUsername("");
      setCredits("");

      loadUsers();
    } catch (err) {
      console.log("Error adding credits", err);
      alert("Failed to add credits");
    }
  };

  // ---------------------
  //   FILTERS
  // ---------------------
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
      data = data.sort((a, b) => a.credits - b.credits);
    } else if (creditSort === "desc") {
      data = data.sort((a, b) => b.credits - a.credits);
    }

    setFiltered(data);
    setPage(1);
  }, [search, roleFilter, creditSort, users]);

  // ---------------------
  //   PAGINATION
  // ---------------------
  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  return (
    <div className="space-y-10 px-2">

      <h1 className="text-2xl font-bold">Add Credits</h1>

      {/* Add Form */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun max-w-xl mx-auto shadow-lg">
        <label>User Name</label>
        <div className="flex items-center gap-2 mt-2 bg-black/40 p-3 rounded border border-metallic-gun">
          <UserPlus size={18} className="text-gray-400" />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="enter username..."
            className="bg-transparent flex-1 text-white outline-none"
          />
        </div>

        <label className="mt-4 block">Credits</label>
        <div className="flex items-center gap-2 mt-2 bg-black/40 p-3 rounded border border-metallic-gun">
          <Plus size={18} className="text-gray-400" />
          <input
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            placeholder="enter credits..."
            type="number"
            className="bg-transparent flex-1 text-white outline-none"
          />
        </div>

        <button
          onClick={handleAddCredits}
          className="mt-5 bg-accent text-black px-5 py-2 rounded-lg font-semibold hover:bg-accent/80 transition"
        >
          Add Credits
        </button>
      </div>

      {/* Table */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun shadow-lg">

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-5">
          <div className="flex items-center bg-black/40 p-2 rounded border border-metallic-gun flex-1">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="bg-transparent text-white outline-none flex-1"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 bg-black/40 border border-metallic-gun text-white rounded"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

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

        {/* Table */}
        <table className="w-full text-left border-collapse">
          <thead className="bg-metallic-gun">
            <tr>
              <th className="p-3 border border-metallic-gun">ID</th>
              <th className="p-3 border border-metallic-gun">User</th>
              <th className="p-3 border border-metallic-gun">Role</th>
              <th className="p-3 border border-metallic-gun">Credits</th>
              <th className="p-3 border border-metallic-gun">Created At</th>
            </tr>
          </thead>

          <tbody>
            {/* FULL SHIMMER - No Data Flash */}
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
                  <td className="p-3 capitalize">{u.role}</td>
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

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-6">
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
