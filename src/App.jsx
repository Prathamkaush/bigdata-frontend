import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import Dashboard from "./pages/Dashboard.jsx";

import CreateUser from "./pages/Createusers.jsx"; 
import UserDetails from "./pages/usersdetails.jsx"
import UsersList from "./pages/userslist.jsx";

import CreditsMain from "./pages/CreditsMain.jsx";
import AddCredits from "./pages/AddCredits.jsx";
import ManageCredits from "./pages/ManageCredits.jsx";

import Logs from "./pages/Logger.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import Settings from "./pages/Settings.jsx";
import Feedback from "./pages/Feedback.jsx";
import RecordsList from "./pages/Records.jsx";



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

          {/* USERS MODULE */}
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/users/list" element={<UsersList />} />
          <Route path="/users/:id" element={<UserDetails />} />

          {/*feedback*/}
          <Route path="/feedback" element={<Feedback />} />

          {/*credits*/}
          <Route path="/credits" element={<CreditsMain />} />
          <Route path="/credits/add" element={<AddCredits />} />
          <Route path="/credits/manage" element={<ManageCredits />} />

          <Route path="/logs" element={<Logs />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<Settings />} />

          {/*records*/}
          <Route path="/records" element={<RecordsList />} />

        </Route>

        {/* Optional 404 */}
        <Route path="*" element={<div className="p-10 text-white">404 Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}
