// src/pages/roles/CreateSubAdmin.jsx
import { useState } from "react";
import api from "../api/admin";
import { UserPlus } from "lucide-react";

export default function CreateSubAdmin() {
  const [username, setUsername] = useState("");
  const [credits, setCredits] = useState(100);
  const [loading, setLoading] = useState(false);

  const createSubAdmin = async () => {
    if (!username.trim()) return alert("Username required");

    setLoading(true);

    try {
      const res = await api.post("/v1/admin/create-user", {
        username,
        role: "sub_admin",
        credits,
      });

      alert(`Sub Admin Created!\nAPI Key: ${res.data.api_key}`);
      setUsername("");
      setCredits(100);
    } catch (err) {
      console.log(err);
      alert("Failed to create sub admin");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold">Create Sub Admin</h1>

      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun">

        <label className="block text-gray-300 mb-2">Username</label>
        <input
          className="w-full p-3 rounded bg-black/40 border border-metallic-gun text-white"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block mt-4 text-gray-300 mb-2">Initial Credits</label>
        <input
          type="number"
          className="w-full p-3 rounded bg-black/40 border border-metallic-gun text-white"
          value={credits}
          onChange={(e) => setCredits(Number(e.target.value))}
        />

        <button
          onClick={createSubAdmin}
          disabled={loading}
          className="mt-5 w-full bg-accent text-black px-5 py-2 rounded-lg text-lg font-semibold"
        >
          <UserPlus size={16} className="inline mr-2" />
          {loading ? "Creating..." : "Create Sub Admin"}
        </button>
      </div>
    </div>
  );
}
