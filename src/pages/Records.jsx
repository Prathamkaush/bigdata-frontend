import { useEffect, useState, useCallback } from "react";
import { fetchRecords } from "../api/records";
import Loader from "../components/Loader/loader";
import { Search, Eye, Copy, Check } from "lucide-react";

export default function RecordsList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [limit] = useState(50);
  const [offset, setOffset] = useState(0);

  const [total, setTotal] = useState(0);

  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [copiedId, setCopiedId] = useState(false);

  // --- Debounce search ---
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // --- Fetch count + records ---
  const load = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetchRecords({ search: debouncedSearch, limit, offset });
      const data = Array.isArray(res.data) ? res.data : [];
      setRecords(data);

      // fetch count
      const countRes = await fetchRecords({ countOnly: true });
      setTotal(countRes.data?.total || 0);
    } catch (err) {
      console.error("Failed loading records", err);
    }

    setLoading(false);
  }, [debouncedSearch, offset]);

  useEffect(() => {
    load();
  }, [load]);

  const nextPage = () => {
    if (offset + limit < total) setOffset(offset + limit);
  };

  const prevPage = () => setOffset(Math.max(0, offset - limit));

  const openDrawer = (rec) => {
    setSelected(rec);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelected(null);
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1200);
  };

  const flag = (country) => {
    try {
      return country
        .trim()
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(127397 + char.charCodeAt())
        );
    } catch {
      return "🌍";
    }
  };

  const scoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="p-6 space-y-6 relative">
      <h1 className="text-2xl font-bold">User Records</h1>

      {/* Search Input */}
      <div className="flex items-center bg-metallic-plate border border-metallic-gun rounded-lg px-4 py-2 w-full max-w-md">
        <Search className="text-gray-400 mr-2" size={18} />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOffset(0);
          }}
          className="bg-transparent outline-none text-white w-full"
          placeholder="Search by name, email, phone..."
        />
      </div>

      {/* Loader */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Table */}
          <div className="bg-metallic-plate p-4 rounded-lg border border-metallic-gun overflow-x-auto shadow-lg">
            {records.length === 0 ? (
              <div className="text-gray-400 text-center py-10">
                No records found.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-metallic-plate z-20">
                  <tr className="text-gray-300 border-b border-gray-700">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">Source</th>
                    <th className="text-left p-2">Score</th>
                    <th className="text-left p-2">City</th>
                    <th className="text-left p-2">Country</th>
                    <th className="text-left p-2">Uploaded</th>
                    <th className="text-left p-2">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((r, idx) => (
                    <tr
                      key={idx}
                      className={`border-t border-gray-800 transition hover:bg-metallic-plate/50 ${
                        r.is_duplicate === 1 ? "bg-red-900/20" : ""
                      }`}
                    >
                      <td className="p-2 flex items-center gap-2">
                        {r.full_name || "—"}
                        {r.is_duplicate === 1 && (
                          <span className="px-2 py-0.5 text-xs rounded bg-red-600/20 text-red-400">
                            DUPLICATE
                          </span>
                        )}
                      </td>

                      <td className="p-2">{r.email || "—"}</td>
                      <td className="p-2">{r.phone || "—"}</td>

                      <td className="p-2 capitalize">{r.source || "—"}</td>

                      <td className={`p-2 font-bold ${scoreColor(r.score)}`}>
                        {r.score}
                      </td>

                      <td className="p-2">{r.city || "—"}</td>

                      <td className="p-2 flex items-center gap-1">
                        {flag(r.country)} {r.country || "—"}
                      </td>

                      <td className="p-2 text-gray-400">
                        {new Date(r.uploaded_at).toLocaleString()}
                      </td>

                      <td className="p-2">
                        <button
                          onClick={() => openDrawer(r)}
                          className="px-2 py-1 bg-accent text-black rounded flex items-center gap-1"
                        >
                          <Eye size={16} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              disabled={offset === 0}
              onClick={prevPage}
              className={`px-4 py-2 rounded ${
                offset === 0
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-accent text-black"
              }`}
            >
              Previous
            </button>

            <div className="text-gray-400 text-sm">
              Page {offset / limit + 1} / {Math.ceil(total / limit)}
            </div>

            <button
              disabled={offset + limit >= total}
              onClick={nextPage}
              className={`px-4 py-2 rounded ${
                offset + limit >= total
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-accent text-black"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* SIDE DRAWER */}
      {drawerOpen && selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50">
          <div className="w-96 h-full bg-metallic-plate p-6 border-l border-metallic-gun overflow-y-auto animate-slideIn">
            <h2 className="text-xl font-bold mb-4">Record Details</h2>

            {/* ID with copy button */}
            <div className="mb-4 flex justify-between items-center">
              <div>
                <div className="uppercase text-xs text-gray-400">ID</div>
                <div className="text-white break-all">{selected.id}</div>
              </div>

              <button
                onClick={() => copyId(selected.id)}
                className="p-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                {copiedId ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>

            {/* Grouped fields */}
            <div className="space-y-6">
              {/* Personal */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Info</h3>
                <Field label="Full Name" value={selected.full_name} />
                <Field label="Email" value={selected.email} />
                <Field label="Phone" value={selected.phone} />
                <Field label="Gender" value={selected.gender} />
                <Field label="Age" value={selected.age} />
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <Field label="City" value={selected.city} />
                <Field label="State" value={selected.state} />
                <Field label="Country" value={selected.country} />
                <Field label="Zipcode" value={selected.zipcode} />
              </div>

              {/* Metadata */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <Field label="Source" value={selected.source} />
                <Field label="Score" value={selected.score} />
                <Field label="Dedupe Key" value={selected.dedupe_key} />
              </div>

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Timestamps</h3>
                <Field label="Uploaded At" value={selected.uploaded_at} />
                <Field label="Normalized At" value={selected.normalized_at} />
                <Field label="Updated At" value={selected.updated_at} />
              </div>

              {/* Raw JSON */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Raw JSON</h3>
                <pre className="bg-black/40 p-3 rounded text-xs text-gray-300 overflow-x-auto">
                  {selected.raw_data}
                </pre>
              </div>
            </div>

            <button
              onClick={closeDrawer}
              className="mt-6 w-full py-2 bg-red-500 rounded text-white"
            >
              Close
            </button>
          </div>

          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            .animate-slideIn {
              animation: slideIn 0.3s ease-out forwards;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="mb-2">
      <div className="uppercase text-xs text-gray-400">{label}</div>
      <div className="text-white break-all">{String(value || "—")}</div>
    </div>
  );
}
