import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import ProtectedLayout from "./components/layout/ProtectedLayout";

import Dashboard from "./pages/dashboard/Dashboard";
import CreateUser from "./pages/users/CreateUser";  // FIXED
import Credits from "./pages/credits/Credits";
import Logs from "./pages/logs/Logs";               // FIXED
import StatsPage from "./pages/stats/StatsPage";    // FIXED
import Settings from "./pages/settings/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root → dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<CreateUser />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<div className="p-10 text-white">404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
