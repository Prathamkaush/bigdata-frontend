import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import Dashboard from "./pages/Dashboard.jsx";
import CreateUser from "./pages/UserCreation.jsx";
import Credits from "./pages/Credits.jsx";
import Logs from "./pages/Logger.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import Settings from "./pages/Settings.jsx";

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
