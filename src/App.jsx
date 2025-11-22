import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import CreateUser from "./pages/users/createuser.jsx";
import Credits from "./pages/credits/credits.jsx";
import Logs from "./pages/logs/logs.jsx";
import StatsPage from "./pages/stats/statsPage.jsx";
import Settings from "./pages/settings/settings.jsx";

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

        {/* Optional 404 */}
        <Route path="*" element={<div className="p-10 text-white">404 Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}
