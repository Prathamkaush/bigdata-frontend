import { useState } from "react";
import api from "../api/admin";
import { ShieldPlus } from "lucide-react";

export default function CreateAdmin() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("sub_admin");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);

  const handleCreate = async () => {
    if (!username) return alert("Username required");

    setLoading(true);
    try {
      const res = await api.post("/v1/admin/create-admin", {
        username,
        role,
      });

      setCreated(res.data);
      alert("User created!");
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-lg">

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ShieldPlus /> Create Admin / Subadmin
      </h1>

      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun space-y-4">

        <div>
          <label className="text-sm">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded bg-black/40 border border-metallic-gun text-white"
          />
        </div>

        <div>
          <label className="text-sm">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 rounded bg-black/40 border border-metallic-gun text-white"
          >
            <option value="admin">Admin</option>
            <option value="sub_admin">Sub Admin</option>
            <option value="viewer">Viewer (Read only)</option>
          </select>
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-accent text-black font-semibold py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>

      {created && (
        <div className="bg-metallic-plate border border-metallic-gun p-6 rounded-xl mt-4">
          <h2 className="text-accent font-bold">Created!</h2>
          <p className="text-gray-300 mt-2">Username: {created.username}</p>
          <p className="text-gray-300">Role: {created.role}</p>
          <p className="text-gray-300">API Key: {created.api_key}</p>
        </div>
      )}
    </div>
  );
}
