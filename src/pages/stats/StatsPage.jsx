import { useEffect, useState } from "react";
import api from "../../api/admin.js";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

import Loader from "../../components/Loader/loader.jsx";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [daily, setDaily] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const rowsPerPage = 10;

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    try {
      const res = await api.get("/v1/admin/stats");
      setStats(res.data);
      setDaily(res.data.daily_usage || []);
      setCurrentPage(1);
    } catch (err) {
      console.log("Error loading stats", err);
    }

    setTimeout(() => setLoading(false), 400); // small delay for smooth shimmer
  };

  const totalPages = Math.ceil(daily.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = daily.slice(startIndex, startIndex + rowsPerPage);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const prevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  const chartData = {
    labels: daily.map((d) => d.date),
    datasets: [
      {
        label: "Daily Requests",
        data: daily.map((d) => d.count),
        borderColor: "#ffffff",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: "#e6e6e6",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { ticks: { color: "#ccc" }, grid: { color: "#333" } },
      x: { ticks: { color: "#ccc" }, grid: { color: "#222" } },
    },
  };

  return (
    <div className="relative space-y-10">

      {/* 🟦 Full Screen Loader */}
      {loading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      <h1 className="text-2xl font-bold">Statistics</h1>

      {/* 🟦 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-metallic-plate p-5 rounded-xl border border-metallic-gun animate-pulse"
            >
              <div className="h-4 w-24 bg-gray-700 rounded mb-3"></div>
              <div className="h-8 w-20 bg-gray-600 rounded"></div>
            </div>
          ))
        ) : (
          <>
            <StatCard title="Total Requests" value={stats?.total_requests} />
            <StatCard title="Today's Requests" value={stats?.today_requests} />
            <StatCard title="Credits Used" value={stats?.credits_used} />
          </>
        )}
      </div>

      {/* 🟦 Chart */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun">
        <h2 className="text-lg font-semibold mb-4">Daily API Usage</h2>

        {loading ? (
          <div className="h-56 w-full animate-pulse bg-black/20 rounded-lg"></div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

      {/* 🟦 Daily Breakdown Table */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun">
        <h2 className="text-lg font-semibold mb-4">Daily Breakdown</h2>

        <table className="w-full border-collapse">
          <thead className="bg-metallic-gun">
            <tr>
              <th className="p-3 border border-metallic-gun">#</th>
              <th className="p-3 border border-metallic-gun">Date</th>
              <th className="p-3 border border-metallic-gun">Requests</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-3">
                    <div className="h-4 bg-gray-700 rounded w-10"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 bg-gray-700 rounded w-32"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                  </td>
                </tr>
              ))
            ) : currentRows.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-400">
                  No data available
                </td>
              </tr>
            ) : (
              currentRows.map((d, i) => (
                <tr
                  key={i}
                  className="border-b border-metallic-gun hover:bg-metallic-dark/40 transition"
                >
                  <td className="p-3 text-gray-400">{startIndex + i + 1}</td>
                  <td className="p-3">{d.date}</td>
                  <td className="p-3">{d.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-metallic-gun text-white rounded disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-gray-300">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-metallic-gun text-white rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-metallic-plate p-5 rounded-xl border border-metallic-gun shadow hover:shadow-xl transition">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-semibold mt-2 text-white">{value ?? "—"}</p>
    </div>
  );
}
