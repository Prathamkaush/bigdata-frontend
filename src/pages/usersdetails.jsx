import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/admin.js";
import Loader from "../components/Loader/loader.jsx";
import StatCard from "../components/cards/statscard.jsx";
import {
  RefreshCw,
  Trash,
  Shield,
  UserCog,
  Lock,
  Unlock,
} from "lucide-react";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [usage, setUsage] = useState([]);

  const [loading, setLoading] = useState(true);
  const [regenLoading, setRegenLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [roleUpdate, setRoleUpdate] = useState("");

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
      setRoleUpdate(u.data.role);
      setLogs(Array.isArray(log.data) ? log.data : []);
      setUsage(Array.isArray(daily.data) ? daily.data : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // -----------------------------------------------------------
  // ↻ REGENERATE API KEY
  // -----------------------------------------------------------
  const regenerateKey = async () => {
    if (user.role === "admin")
      return alert("❌ Cannot regenerate admin key.");

    if (!confirm("Regenerate API key? Old key will stop working.")) return;

    setRegenLoading(true);
    try {
      const res = await api.post(
        `/v1/admin/user/${user.id}/regenerate-key`
      );
      alert("New API Key:\n" + res.data.api_key + "\n⚠ Copy now!");
      load();
    } catch {
      alert("Failed to regenerate key.");
    }
    setRegenLoading(false);
  };

  // -----------------------------------------------------------
  // 🟦 CHANGE ROLE
  // -----------------------------------------------------------
  const updateRole = async () => {
    if (!confirm(`Change role to ${roleUpdate}?`)) return;

    setActionLoading(true);
    try {
      await api.post(`/v1/admin/user/${user.id}/role`, {
        role: roleUpdate,
      });
      alert("Role updated.");
      load();
    } catch {
      alert("Failed to update role.");
    }
    setActionLoading(false);
  };

  // -----------------------------------------------------------
  // 🟨 DISABLE / ENABLE USER
  // -----------------------------------------------------------
  const toggleStatus = async () => {
    const newStatus = user.status === "active" ? "disabled" : "active";
    if (!confirm(`Change status to ${newStatus}?`)) return;

    setActionLoading(true);
    try {
      await api.post(`/v1/admin/user/${user.id}/status`, {
        status: newStatus,
      });
      alert("Status updated.");
      load();
    } catch {
      alert("Failed to update status.");
    }
    setActionLoading(false);
  };

  // -----------------------------------------------------------
  // ❌ DELETE USER
  // -----------------------------------------------------------
  const deleteUser = async () => {
    if (!confirm("⚠ Delete this user permanently?")) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/v1/admin/user/${user.id}`);
      alert("User deleted.");
      navigate("/users/list");
    } catch {
      alert("Deletion failed.");
    }
    setDeleteLoading(false);
  };

  if (loading || !user) return <Loader />;

  // -----------------------------------------------------------
  // LOG FILTERING
  // -----------------------------------------------------------
  let filteredLogs = [...logs];

  if (endpointFilter.trim() !== "") {
    filteredLogs = filteredLogs.filter((l) =>
      l.endpoint.toLowerCase().includes(endpointFilter.toLowerCase())
    );
  }

  const now = new Date();
  filteredLogs = filteredLogs.filter((l) => {
    const d = new Date(l.created_at);

    if (dateFilter === "today") return d.toDateString() === now.toDateString();
    if (dateFilter === "7") return now - d <= 7 * 86400000;
    if (dateFilter === "30") return now - d <= 30 * 86400000;
    return true;
  });

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (logPage - 1) * logsPerPage,
    logPage * logsPerPage
  );

  const roleBadge = {
    admin: "bg-red-600/20 text-red-400 border border-red-800",
    sub_admin: "bg-blue-600/20 text-blue-300 border border-blue-700",
    user: "bg-gray-600/20 text-gray-300 border border-gray-700",
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-metallic-dark text-accent rounded-lg"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold">User Details</h1>

      {/* MAIN USER INFO CARD */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun relative">
        {(regenLoading || deleteLoading || actionLoading) && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
            <Loader />
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3 justify-end mb-4">

          {user.role !== "admin" && (
            <button
              onClick={regenerateKey}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            >
              <RefreshCw size={18} /> Regenerate Key
            </button>
          )}

          <button
            onClick={toggleStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white ${
              user.status === "active"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {user.status === "active" ? (
              <>
                <Lock size={18} /> Disable User
              </>
            ) : (
              <>
                <Unlock size={18} /> Enable User
              </>
            )}
          </button>

          <button
            onClick={deleteUser}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl"
          >
            <Trash size={18} /> Delete User
          </button>
        </div>

        {/* USER INFO */}
        <h2 className="text-lg font-semibold mb-3">User Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">

          <div><b>ID:</b> {user.id}</div>

          <div><b>Username:</b> {user.username}</div>

          <div>
            <b>Role:</b>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs ${roleBadge[user.role]}`}
            >
              {user.role.replace("_", " ")}
            </span>
          </div>

          <div>
            <b>Status:</b>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                user.status === "active"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {user.status}
            </span>
          </div>

          <div><b>Credits:</b> {user.credits}</div>

          <div><b>Created:</b> {new Date(user.created_at).toLocaleString()}</div>

          <div>
            <b>API Key:</b>{" "}
            <span className="blur-sm hover:blur-none cursor-pointer">
              {user.APIKey}
            </span>
          </div>
        </div>

        {/* ROLE UPDATE */}
        <div className="mt-6 bg-black/30 border border-metallic-gun p-4 rounded-xl">
          <h3 className="text-md font-semibold mb-2">Change Role</h3>

          <div className="flex gap-3">
            <select
              value={roleUpdate}
              onChange={(e) => setRoleUpdate(e.target.value)}
              className="p-3 rounded-lg bg-black/40 border border-metallic-gun text-white"
            >
              <option value="user">User</option>
              <option value="sub_admin">Sub Admin</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={updateRole}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* USER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Requests" value={user.total_requests} />
        <StatCard title="Today's Requests" value={user.today_requests} />
        <StatCard title="Credits Used" value={user.credits_used} />
      </div>

      {/* LOGS SECTION */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun">
        <h2 className="text-lg font-semibold mb-4">User Logs</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

          <input
            type="text"
            placeholder="Filter by endpoint..."
            value={endpointFilter}
            onChange={(e) => setEndpointFilter(e.target.value)}
            className="p-3 rounded-lg bg-black/40 border border-metallic-gun text-white"
          />

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-3 rounded-lg bg-black/40 border border-metallic-gun text-white"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
          </select>

          <button
            onClick={() => setLogPage(1)}
            className="px-4 py-3 bg-metallic-dark text-accent rounded-lg border border-metallic-gun"
          >
            Reset Filters
          </button>
        </div>

        {/* Logs */}
        {paginatedLogs.length === 0 ? (
          <p className="text-gray-400">No logs found.</p>
        ) : (
          paginatedLogs.map((log) => (
            <div
              key={log.id}
              className="py-3 border-b border-metallic-gun text-gray-300"
            >
              <div><b>Endpoint:</b> {log.endpoint}</div>
              <div><b>Credits:</b> {log.credits_used}</div>
              <div><b>Time:</b> {new Date(log.created_at).toLocaleString()}</div>
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">

            <button
              disabled={logPage === 1}
              onClick={() => setLogPage((p) => p - 1)}
              className="px-4 py-2 bg-metallic-dark border border-metallic-gun rounded-lg disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-gray-300">
              Page {logPage} / {totalPages}
            </span>

            <button
              disabled={logPage === totalPages}
              onClick={() => setLogPage((p) => p + 1)}
              className="px-4 py-2 bg-metallic-dark border border-metallic-gun rounded-lg disabled:opacity-40"
            >
              Next
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
