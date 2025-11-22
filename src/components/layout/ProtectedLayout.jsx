import { Outlet, Navigate } from "react-router-dom";
import Layout from "./Layout";

export default function ProtectedLayout() {
  const key = localStorage.getItem("admin_api_key");

  if (!key) return <Navigate to="/login" />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
