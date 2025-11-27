import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// AUTH
import Login from "./pages/Login.jsx";
import ProtectedLayout from "./components/layout/ProtectedLayout";

// DASHBOARD
import Dashboard from "./pages/Dashboard.jsx";

// USERS (Postgres Admin/Subadmin/User accounts)
import CreateAdmin from "./pages/CreateAdmin.jsx"; 
import UsersList from "./pages/userslist.jsx";
import UserDetails from "./pages/usersdetails.jsx";

// CLICKHOUSE RECORDS
import RecordsList from "./pages/Records.jsx";
import UserRecordDetails from "./pages/UserRecordDetails.jsx";
import CreateRecord from "./pages/Createusers.jsx";  // ← NEW ClickHouse version

// ROLES MODULE
import RolesList from "./pages/RolesList.jsx";
import PermissionsMatrix from "./pages/PermissionsMatrix.jsx";

// CREDITS
import CreditsMain from "./pages/CreditsMain.jsx";
import AddCredits from "./pages/AddCredits.jsx";
import ManageCredits from "./pages/ManageCredits.jsx";

// OTHER
import Logs from "./pages/Logger.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import Settings from "./pages/Settings.jsx";
import Feedback from "./pages/Feedback.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT → Redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
        <Route element={<ProtectedLayout />}>

          {/* DASHBOARD */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ---------------------------------- */}
          {/* USERS (POSTGRES) */}
          {/* ---------------------------------- */}
          <Route path="/users/list" element={<UsersList />} />
          <Route path="/users/:id" element={<UserDetails />} />

          {/* Create Admin/Subadmin/Viewer (Postgres) */}
          <Route path="/role/create" element={<CreateAdmin />} />

          {/* ---------------------------------- */}
          {/* CLICKHOUSE RECORDS */}
          {/* ---------------------------------- */}
          <Route path="/records" element={<RecordsList />} />
          <Route path="/record/:id" element={<UserRecordDetails />} />
          <Route path="/record/create" element={<CreateRecord />} />

          {/* ---------------------------------- */}
          {/* ROLES */}
          {/* ---------------------------------- */}
          <Route path="/roles" element={<RolesList />} />
          <Route path="/roles/permissions" element={<PermissionsMatrix />} />

          {/* ---------------------------------- */}
          {/* FEEDBACK */}
          {/* ---------------------------------- */}
          <Route path="/feedback" element={<Feedback />} />

          {/* ---------------------------------- */}
          {/* CREDITS */}
          {/* ---------------------------------- */}
          <Route path="/credits" element={<CreditsMain />} />
          <Route path="/credits/add" element={<AddCredits />} />
          <Route path="/credits/manage" element={<ManageCredits />} />

          {/* ---------------------------------- */}
          {/* LOGS + STATS + SETTINGS */}
          {/* ---------------------------------- */}
          <Route path="/logs" element={<Logs />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<Settings />} />

        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<div className="p-10 text-white">404 Not Found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
