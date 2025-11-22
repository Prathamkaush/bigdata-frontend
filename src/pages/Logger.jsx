import { useEffect, useState } from "react";
import api from "../api/admin.js";
import { Search, RefreshCcw } from "lucide-react";
import Loader from "../components/Loader/loader.jsx";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);

    try {
      const res = await api.get("/v1/admin/logs");

      // small delay for smoother shimmer feel
      setTimeout(() => {
        setLogs(res.data);
        setFiltered(res.data);
        setLoading(false);
      }, 300);
    } catch (err) {
      console.log("Error loading logs", err);
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);

    if (!value.trim()) {
      setFiltered(logs);
      return;
    }

    const result = logs.filter((log) =>
      JSON.stringify(log)
        .toLowerCase()
        .includes(value.toLowerCase())
    );

    setFiltered(result);
    setPage(1);
  };

  const paginatedLogs = filtered.slice(
    (page - 1) * logsPerPage,
    page * logsPerPage
  );

  const totalPages = Math.ceil(filtered.length / logsPerPage);

  return (
    <div className="relative">

      {/* FULL PAGE LOADER OVERLAY */}
      {loading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">API Logs</h1>

        <button
          onClick={loadLogs}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded hover:bg-white transition"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {/* Search Box */}
      <div className="flex items-center bg-metallic-plate p-3 rounded border border-metallic-gun mb-5">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search logs..."
          className="bg-transparent flex-1 text-white outline-none"
        />
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-metallic-gun sticky top-0">
            <tr>
              <th className="p-3 border border-metallic-gun">Id</th>
              <th className="p-3 border border-metallic-gun">User ID</th>
              <th className="p-3 border border-metallic-gun">Endpoint</th>
              <th className="p-3 border border-metallic-gun">Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {/* ✨ SHIMMER ROWS */}
            {loading &&
              [...Array(10)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-3">
                    <div className="h-4 bg-metallic-gun/50 rounded w-10"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 bg-metallic-gun/50 rounded w-20"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 bg-metallic-gun/50 rounded w-40"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 bg-metallic-gun/50 rounded w-32"></div>
                  </td>
                </tr>
              ))}

            {/* ✨ NO LOGS */}
            {!loading && paginatedLogs.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">
                  No logs found.
                </td>
              </tr>
            )}

            {/* ✨ REAL DATA */}
            {!loading &&
              paginatedLogs.map((log, index) => {
                const globalIndex =
                  (page - 1) * logsPerPage + index + 1;

                return (
                  <tr
                    key={globalIndex}
                    className="border-b border-metallic-gun hover:bg-metallic-plate/60 transition"
                  >
                    <td className="p-3 text-gray-400">{globalIndex}</td>
                    <td className="p-3">{log.user_id}</td>
                    <td className="p-3">{log.endpoint}</td>
                    <td className="p-3">
                      {new Date(log.created_at).toLocaleString("en-IN", {
                        hour12: true,
                      })}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

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

          <span className="text-gray-300">
            Page {page} of {totalPages}
          </span>

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
  );
}
