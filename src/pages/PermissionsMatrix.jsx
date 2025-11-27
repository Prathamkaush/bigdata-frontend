// src/pages/roles/PermissionsMatrix.jsx
import { Shield } from "lucide-react";

export default function PermissionsMatrix() {
  const permissions = [
    {
      module: "Dashboard",
      admin: true,
      sub: true,
    },
    {
      module: "Users List",
      admin: true,
      sub: true,
    },
    {
      module: "Create User",
      admin: true,
      sub: false,
    },
    {
      module: "Add Credits",
      admin: true,
      sub: false,
    },
    {
      module: "Manage Credits",
      admin: true,
      sub: false,
    },
    {
      module: "User Records",
      admin: true,
      sub: true,
    },
    {
      module: "Logs",
      admin: true,
      sub: true,
    },
    {
      module: "Stats",
      admin: true,
      sub: true,
    },
    {
      module: "Settings",
      admin: true,
      sub: false,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Shield size={24} className="text-accent" />
        Permissions Matrix
      </h1>

      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 border-b border-metallic-gun">
              <th className="py-2">Module</th>
              <th className="py-2">Admin</th>
              <th className="py-2">Sub Admin</th>
            </tr>
          </thead>

          <tbody>
            {permissions.map((p, idx) => (
              <tr key={idx} className="text-white border-b border-metallic-gun/50">
                <td className="py-2">{p.module}</td>
                <td className="py-2">{p.admin ? "✔️" : "❌"}</td>
                <td className="py-2">{p.sub ? "✔️" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
