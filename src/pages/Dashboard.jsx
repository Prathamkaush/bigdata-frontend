// src/pages/Dashboard.jsx
import {
  Activity,
  Users,
  CreditCard,
  BarChart3,
  AlertTriangle,
  UserPlus,
  Star,
} from "lucide-react";

import { useEffect, useState, useRef } from "react";
import api from "../api/admin.js";
import Loader from "../components/Loader/loader.jsx";

import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v1/admin/stats");
      setStats(res.data);
      // normalize daily_usage into expected fields if backend differs
      const normalized = (res.data.daily_usage || []).map((d) => ({
        date: d.date || d.Date || d.day || "",
        requests: d.requests ?? d.count ?? 0,
        credits_used: d.credits_used ?? d.credits_used ?? 0,
        new_users: d.new_users ?? d.new_users ?? d.new_users ?? d.new_users ?? 0,
      }));
      setDaily(normalized);
    } catch (err) {
      console.error("Error loading stats", err);
    }
    setLoading(false);
  };

  // lightweight scriptable gradient helper for Chart.js
  const gradientFill = (ctx, area, colorFrom, colorTo) => {
    if (!ctx) return colorFrom;
    const grad = ctx.createLinearGradient(0, area.top, 0, area.bottom);
    grad.addColorStop(0, colorFrom);
    grad.addColorStop(1, colorTo);
    return grad;
  };

  const chartData = {
    labels: daily.map((d) => d.date),
    datasets: [
      {
        type: "line",
        label: "Requests",
        data: daily.map((d) => d.requests),
        borderWidth: 3,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        // use scriptable to create gradient on render
        borderColor: (ctx) => {
          const c = ctx.chart.ctx;
          return gradientFill(c, ctx.chart.chartArea || { top: 0, bottom: 300 }, "#4ADE80", "#16a34a");
        },
        backgroundColor: (ctx) => {
          const c = ctx.chart.ctx;
          return gradientFill(c, ctx.chart.chartArea || { top: 0, bottom: 300 }, "rgba(74,222,128,0.12)", "rgba(22,163,74,0.02)");
        },
        fill: true,
        order: 1,
      },
      {
        type: "bar",
        label: "Credits Used",
        data: daily.map((d) => d.credits_used),
        backgroundColor: (ctx) => {
          const c = ctx.chart.ctx;
          return gradientFill(c, ctx.chart.chartArea || { top: 0, bottom: 300 }, "rgba(248,113,113,0.9)", "rgba(248,113,113,0.45)");
        },
        borderRadius: 6,
        barThickness: 14,
        order: 2,
      },
      {
        type: "line",
        label: "New Users",
        data: daily.map((d) => d.new_users),
        borderWidth: 2.5,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderColor: (ctx) => {
          const c = ctx.chart.ctx;
          return gradientFill(c, ctx.chart.chartArea || { top: 0, bottom: 300 }, "#60A5FA", "#1e40af");
        },
        backgroundColor: "transparent",
        order: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        labels: { color: "#d1d5db" },
        position: "top",
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        // subtle animation
        animation: { duration: 200, easing: "easeOutQuart" },
      },
    },
    animation: {
      duration: 700,
      easing: "easeOutQuart",
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1", maxRotation: 0, autoSkip: true },
        grid: { color: "#111827" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#cbd5e1" },
        grid: { color: "#0f1724" },
      },
    },
    // lightweight plugin to avoid gradient errors before area is ready
    plugins: [
      {
        id: "cleaner",
        beforeInit: function (chart) {
          // noop — gradients are created in scriptable functions above
        },
      },
    ],
  };

  // build alerts array (keeps it simple & light)
  const alerts = [];
  if (stats?.low_credit_users > 0) alerts.push(`⚠ ${stats.low_credit_users} users have low credits`);
  if (stats?.new_users_today > 0) alerts.push(`🎉 ${stats.new_users_today} new users joined today`);
  if (stats?.new_feedback_today > 0) alerts.push(`💬 ${stats.new_feedback_today} new feedback`);

  return (
    <div className="space-y-6 relative">
      {/* FULL PAGE LOADER */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>

      {/* ALERT TICKER */}
      <div className="bg-metallic-plate border border-metallic-gun p-3 rounded-lg overflow-hidden">
        {alerts.length > 0 ? (
          <div className="overflow-hidden">
            {/* gentle marquee using CSS animation instead of <marquee> */}
            <div className="whitespace-nowrap animate-slide px-2 text-accent font-semibold">
              {alerts.join(" • ")}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No new alerts</p>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Requests" icon={<Activity size={20} />} value={stats?.total_requests ?? "—"} />
        <StatCard title="Today's Requests" icon={<BarChart3 size={20} />} value={stats?.today_requests ?? "—"} />
        <StatCard title="Credits Used" icon={<CreditCard size={20} />} value={stats?.credits_used ?? "—"} />
        <StatCard title="Total Users" icon={<Users size={20} />} value={stats?.total_users ?? "—"} />
      </div>

      {/* ALERT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertCard title="Low Credit Users" value={stats?.low_credit_users ?? 0} icon={<AlertTriangle />} color="red" />
        <AlertCard title="New Users Today" value={stats?.new_users_today ?? 0} icon={<UserPlus />} color="blue" />
        <AlertCard title="New Feedback" value={stats?.new_feedback_today ?? 0} icon={<Star />} color="yellow" />
      </div>

      {/* CHART */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun" style={{ height: 420 }}>
        <h2 className="text-lg font-semibold mb-4">Daily Usage</h2>
        {daily.length === 0 ? (
          <div className="text-center text-gray-400 py-20">No usage history yet.</div>
        ) : (
          <Chart ref={chartRef} type="bar" data={chartData} options={chartOptions} />
        )}
      </div>

      {/* small styles for marquee */}
      <style>{`
        @keyframes slide {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-slide {
          display:inline-block;
          animation: slide 12s linear infinite;
        }
      `}</style>
    </div>
  );
}

/* -------------------------------
   PRESENTATIONAL COMPONENTS
--------------------------------*/
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-metallic-plate p-5 rounded-xl border border-metallic-gun shadow-sm transform transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-md text-gray-300">{title}</h3>
        <div className="text-accent">{icon}</div>
      </div>
      <div className="text-3xl font-bold mt-3 text-white">{value}</div>
    </div>
  );
}

function AlertCard({ title, value, icon, color }) {
  // color: 'red' | 'blue' | 'yellow'
  const map = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-400 text-black",
  };
  return (
    <div className={`${map[color] || "bg-gray-600"} p-4 rounded-xl flex items-center gap-4 transform transition hover:scale-[1.01]`}>
      <div className="p-3 bg-black/20 rounded-full">{icon}</div>
      <div>
        <div className="text-sm opacity-90">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}
