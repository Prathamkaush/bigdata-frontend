import { useState } from "react";
import api from "../api/admin";
import { UserPlus } from "lucide-react";

export default function CreateUser() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("sub_admin");
  const [credits, setCredits] = useState(100);
  const [loading, setLoading] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  const handleCreate = async () => {
    if (!username) return alert("Username is required!");
    setLoading(true);

    try {
      const res = await api.post("/v1/admin/create-user", {
        username,
        role,
        credits,
      });

      setCreatedUser(res.data);
      alert("User created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <UserPlus /> Create User
      </h1>

      <div className="bg-metallic-plate border border-metallic-gun p-6 rounded-xl space-y-4 max-w-lg">

        {/* Username */}
        <div>
          <label className="text-sm text-gray-300">Username</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-metallic-dark border border-metallic-gun text-white mt-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username..."
          />
        </div>

        {/* Role */}
        <div>
          <label className="text-sm text-gray-300">Role</label>
          <select
            className="w-full p-2 rounded bg-metallic-dark border border-metallic-gun text-white mt-1"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="sub_admin">Sub Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* Credits */}
        <div>
          <label className="text-sm text-gray-300">Starting Credits</label>
          <input
            type="number"
            className="w-full p-2 rounded bg-metallic-dark border border-metallic-gun text-white mt-1"
            value={credits}
            onChange={(e) => setCredits(Number(e.target.value))}
            min="0"
          />
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-accent text-black font-semibold py-2 rounded-lg hover:bg-accent/90 transition"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </div>

      {/* SHOW RAW API KEY */}
      {createdUser && (
        <div className="bg-metallic-plate border border-metallic-gun p-6 rounded-xl max-w-lg">
          <h2 className="text-lg font-bold text-accent">User Created!</h2>

          <p className="mt-2 text-gray-300">
            <strong>Username:</strong> {createdUser.user.username}
          </p>
          <p className="text-gray-300">
            <strong>Role:</strong> {createdUser.user.role}
          </p>
          <p className="text-gray-300">
            <strong>Credits:</strong> {createdUser.user.credits}
          </p>

          <div className="mt-4 bg-black/30 p-3 rounded-lg border border-metallic-gun">
            <p className="text-accent font-bold">API Key:</p>
            <p className="text-white break-all">{createdUser.api_key}</p>
          </div>
        </div>
      )}
    </div>
  );
}
