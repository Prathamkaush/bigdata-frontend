import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/admin.js";
import Loader from "../components/Loader/loader.jsx";
import StatCard from "../components/cards/statscard.jsx";
import { RefreshCw, Trash } from "lucide-react";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  const [regenLoading, setRegenLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [logPage, setLogPage] = useState(1);
const logsPerPage = 10;

const [dateFilter, setDateFilter] = useState("all");
const [endpointFilter, setEndpointFilter] = useState("");


  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const u = await api.get(`/v1/admin/user/${id}`);
      const log = await api.get(`/v1/admin/user/${id}/logs`);
      const daily = await api.get(`/v1/admin/user/${id}/usage`);

      setUser(u.data);
      setLogs(Array.isArray(log.data) ? log.data : []);
      setUsage(Array.isArray(daily.data) ? daily.data : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // --------------------------------------------------------------------
  // 🔁 Regenerate Key
  // --------------------------------------------------------------------
  const regenerateKey = async () => {
    if (user.role === "admin") return alert("❌ Cannot regenerate admin key.");

    if (!confirm("Regenerate API key? Old key will stop working.")) return;

    setRegenLoading(true);

    try {
      const res = await api.post(`/v1/admin/user/${user.id}/regenerate-key`);
      alert("New API Key:\n" + res.data.api_key + "\n⚠️ Copy now!");
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to regenerate key.");
    }

    setRegenLoading(false);
  };

  // --------------------------------------------------------------------
  // ❌ Delete User
  // --------------------------------------------------------------------
  const deleteUser = async () => {
    if (!confirm("⚠️ Are you sure you want to DELETE this user?")) return;

    setDeleteLoading(true);

    try {
      await api.delete(`/v1/admin/user/${user.id}`);
      alert("User deleted.");
      navigate("/users/list");
    } catch (err) {
      console.error(err);
      alert("Deletion failed.");
    }

    setDeleteLoading(false);
  };

  
  
  if (loading || !user) return <Loader />;
// --------------------------
// LOG FILTERING
// --------------------------
let filteredLogs = [...logs];

// Filter by endpoint
if (endpointFilter.trim() !== "") {
  filteredLogs = filteredLogs.filter((l) =>
    l.endpoint.toLowerCase().includes(endpointFilter.toLowerCase())
  );
}

// Date filter
const now = new Date();
filteredLogs = filteredLogs.filter((l) => {
  const logDate = new Date(l.created_at);

  if (dateFilter === "today") {
    return logDate.toDateString() === now.toDateString();
  }
  if (dateFilter === "7") {
    return now - logDate <= 7 * 24 * 60 * 60 * 1000;
  }
  if (dateFilter === "30") {
    return now - logDate <= 30 * 24 * 60 * 60 * 1000;
  }
  return true; // all
});

// Pagination
const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
const paginatedLogs = filteredLogs.slice(
  (logPage - 1) * logsPerPage,
  logPage * logsPerPage
);


  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-metallic-dark text-accent rounded-lg"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold">User Details</h1>

      {/* INFO CARD */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun relative">

        {(regenLoading || deleteLoading) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <Loader />
          </div>
        )}

        {/* BUTTONS TOP RIGHT */}
        <div className="flex flex-wrap gap-3 justify-end mb-4">
          {user.role !== "admin" && (
            <button
              onClick={regenerateKey}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
            >
              <RefreshCw size={18} /> Regenerate Key
            </button>
          )}

          <button
            onClick={deleteUser}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            <Trash size={18} /> Delete User
          </button>
        </div>

        {/* USER INFO */}
        <h2 className="text-lg font-semibold mb-3">User Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
          <div><b>ID:</b> {user.id}</div>
          <div><b>Username:</b> {user.username}</div>
          <div><b>Status:</b> {user.status}</div>
          <div><b>Credits:</b> {user.credits}</div>
          <div><b>Role:</b> {user.role}</div>
          <div><b>Created At:</b> {new Date(user.created_at).toLocaleString()}</div>
          <div>
            <b>API Key:</b>{" "}
            <span className="blur-sm hover:blur-none cursor-pointer">{user.api_key}</span>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Requests" value={user.total_requests} />
        <StatCard title="Today's Requests" value={user.today_requests} />
        <StatCard title="Credits Used" value={user.credits_used} />
      </div>

      {/* LOGS SECTION */}
<div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun">
  <h2 className="text-lg font-semibold mb-4">Recent Logs</h2>

  {/* Filters */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

    {/* Endpoint Filter */}
    <input
      type="text"
      placeholder="Filter by endpoint..."
      value={endpointFilter}
      onChange={(e) => setEndpointFilter(e.target.value)}
      className="w-full p-3 rounded-lg bg-black/40 border border-metallic-gun text-white"
    />

    {/* Date Filter */}
    <select
      value={dateFilter}
      onChange={(e) => setDateFilter(e.target.value)}
      className="w-full p-3 rounded-lg bg-black/40 border border-metallic-gun text-white"
    >
      <option value="all">All Time</option>
      <option value="today">Today</option>
      <option value="7">Last 7 Days</option>
      <option value="30">Last 30 Days</option>
    </select>

    {/* Page Reset Button */}
    <button
      onClick={() => setLogPage(1)}
      className="px-4 py-3 bg-metallic-dark text-accent rounded-lg border border-metallic-gun"
    >
      Reset Filters
    </button>
  </div>

  {/* Logs List */}
  {paginatedLogs.length === 0 ? (
    <p className="text-gray-400">No logs found.</p>
  ) : (
    paginatedLogs.map((log) => (
      <div
        key={log.id}
        className="border-b border-metallic-gun py-3 text-gray-300"
      >
        <div><b>Endpoint:</b> {log.endpoint}</div>
        <div><b>Credits:</b> {log.credits_used}</div>
        <div><b>Time:</b> {new Date(log.created_at).toLocaleString()}</div>
      </div>
    ))
  )}

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="flex items-center justify-center gap-4 mt-4">

      <button
        disabled={logPage === 1}
        onClick={() => setLogPage((prev) => prev - 1)}
        className="px-4 py-2 bg-metallic-dark text-white border border-metallic-gun rounded-lg disabled:opacity-40"
      >
        Prev
      </button>

      <span className="text-gray-300">
        Page {logPage} / {totalPages}
      </span>

      <button
        disabled={logPage === totalPages}
        onClick={() => setLogPage((prev) => prev + 1)}
        className="px-4 py-2 bg-metallic-dark text-white border border-metallic-gun rounded-lg disabled:opacity-40"
      >
        Next
      </button>

    </div>
  )}
</div>
      
    </div>
  );
}
