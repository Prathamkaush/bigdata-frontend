import {
  Activity,
  Users,
  CreditCard,
  BarChart3,
} from "lucide-react";

import { useEffect, useState } from "react";
import api from "../api/admin.js";
import Loader from "../components/Loader/loader.jsx";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    try {
      const res = await api.get("/v1/admin/stats");   // ✅ ADMIN ENDPOINT
      setStats(res.data);
      setDaily(res.data.daily_usage || []);
    } catch (err) {
      console.log("Error loading stats", err);
    }

    setLoading(false);
  };

  // Chart Data
  const chartData = {
    labels: daily.map((d) => d.date),
    datasets: [
      {
        label: "Daily Requests",
        data: daily.map((d) => d.count),
        borderWidth: 2,
        tension: 0.3,
        borderColor: "#ffffff",
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
    <div className="space-y-6 relative">

      {/* FULL PAGE LOADER */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>

      {/* ===============================
          STAT CARDS
      =============================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Requests" icon={<Activity size={20} />} value={stats?.total_requests ?? "—"} />
        <StatCard title="Today" icon={<BarChart3 size={20} />} value={stats?.today_requests ?? "—"} />
        <StatCard title="Credits Used" icon={<CreditCard size={20} />} value={stats?.credits_used ?? "—"} />
        <StatCard title="Total Users" icon={<Users size={20} />} value={stats?.total_users ?? "—"} />
      </div>

      {/* ===============================
          CHART
      =============================== */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun">
        <h2 className="text-lg font-semibold mb-4">Daily Usage</h2>

        {daily.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No usage history yet.
          </div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-metallic-plate p-5 rounded-xl border border-metallic-gun shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-md text-gray-300">{title}</h3>
        <div className="text-accent">{icon}</div>
      </div>
      <div className="text-3xl font-bold mt-3 text-white">{value}</div>
    </div>
  );
}
