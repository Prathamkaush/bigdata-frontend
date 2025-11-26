import { useEffect, useState } from "react";
import api from "../api/admin.js";
import { Search, Star, Inbox, CheckCircle, Clock } from "lucide-react";
import Loader from "../components/Loader/loader.jsx";

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v1/admin/feedback?page=1");

      // if backend doesn't send status → fallback to "new"
      const withStatus = res.data.data.map((f) => ({
        ...f,
        status: f.status || "new",
      }));

      setFeedback(withStatus);
      setFiltered(withStatus);
    } catch (err) {
      console.error("Error loading feedback", err);
    }
    setTimeout(() => setLoading(false), 300);
  };

  // 🔍 Filter + Search Handling
  useEffect(() => {
    let data = [...feedback];

    if (search.trim().length > 0) {
      data = data.filter(
        (f) =>
          f.message.toLowerCase().includes(search.toLowerCase()) ||
          String(f.user_id).includes(search)
      );
    }

    if (filterStatus !== "all") {
      data = data.filter((f) => f.status === filterStatus);
    }

    setFiltered(data);
    setPage(1);
  }, [search, filterStatus, feedback]);

  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  // ⭐ Rating Render
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
      />
    ));
  };

  return (
    <div className="space-y-8 px-2 md:px-6">
      <h1 className="text-2xl font-bold">User Feedback</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-metallic-plate p-4 rounded-xl border border-metallic-gun">
        
        {/* Search */}
        <div className="flex items-center bg-black/40 p-2 rounded border border-metallic-gun w-full md:w-1/3">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            placeholder="Search feedback..."
            className="bg-transparent flex-1 outline-none text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-3 flex-wrap justify-center">
          {[
            { key: "all", label: "All", icon: Inbox },
            { key: "new", label: "New", icon: Inbox },
            { key: "progress", label: "In-Progress", icon: Clock },
            { key: "fixed", label: "Fixed", icon: CheckCircle },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-metallic-gun transition
                ${
                  filterStatus === f.key
                    ? "bg-accent text-black font-semibold"
                    : "bg-black/40 text-gray-300 hover:bg-accent/30"
                }`}
            >
              <f.icon size={16} />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Cards */}
      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-center">No feedback found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginated.map((fb) => (
            <div
              key={fb.id}
              className="bg-metallic-plate p-5 rounded-xl border border-metallic-gun shadow-lg hover:bg-black/20 transition"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-3">{renderStars(fb.rating)}</div>

              <p className="text-gray-200 mb-3">{fb.message}</p>

              <div className="text-sm text-gray-400">
                <div>User ID: {fb.user_id}</div>
                <div className="mt-1">
                  {new Date(fb.created_at).toLocaleString("en-IN", {
                    hour12: true,
                  })}
                </div>
              </div>

              {/* Status tag */}
              <div
                className={`mt-3 px-3 py-1 text-xs rounded-full inline-block ${
                  fb.status === "new"
                    ? "bg-red-600 text-white"
                    : fb.status === "progress"
                    ? "bg-yellow-500 text-black"
                    : "bg-green-500 text-black"
                }`}
              >
                {fb.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      )}

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
