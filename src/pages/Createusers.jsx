import { useState } from "react";
import api from "../api/admin.js";
import Loader from "../components/Loader/loader.jsx";
import { UserPlus, Key, Copy } from "lucide-react";

export default function CreateUser() {
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [adminKey, setAdminKey] = useState("");

  const [creating, setCreating] = useState(false);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");

  const createUser = async () => {
    if (!name.trim() || name !== confirm || !adminKey.trim()) return;

    setCreating(true);

    try {
      const res = await api.post(
        "/v1/admin/create-user",
        { name },
        { headers: { "x-api-key": adminKey } }
      );

      setNewApiKey(res.data.api_key);
      setShowModal(true);

      setName("");
      setConfirm("");
      setAdminKey("");
    } catch (err) {
      console.error("Error creating user", err);
      alert("Invalid Admin API Key or Server Error");
    }

    setCreating(false);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(newApiKey);
    alert("API Key copied!");
  };

  const isDisabled =
    !name.trim() || !confirm.trim() || name !== confirm || !adminKey.trim();

  return (
    <div className="relative max-w-xl mx-auto space-y-6">
      {/* FULL SCREEN LOADER */}
      {creating && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      <h1 className="text-2xl font-bold">Create User</h1>

      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun">

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="text-accent" size={18} /> New User
        </h2>

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Enter username..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-3 rounded-lg bg-black/40 border border-metallic-gun text-white"
        />

        {/* CONFIRM USERNAME */}
        <input
          type="text"
          placeholder="Confirm username..."
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full p-3 mb-3 rounded-lg bg-black/40 border border-metallic-gun text-white"
        />

        {name && confirm && name !== confirm && (
          <p className="text-red-400 text-sm mb-2">Usernames do not match.</p>
        )}

        {/* ADMIN API KEY */}
        <div className="flex items-center gap-2 mb-3">
          <Key className="text-accent" size={20} />
          <p className="text-gray-300">Admin API Key</p>
        </div>

        <input
          type="password"
          placeholder="Enter admin API key..."
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/40 border border-metallic-gun text-white"
        />

        <button
          onClick={createUser}
          disabled={isDisabled}
          className={`mt-4 w-full font-semibold px-5 py-2 rounded-lg transition ${
            isDisabled
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-accent text-black hover:bg-accent/80"
          }`}
        >
          Create User
        </button>
      </div>

      {/* ===============================
          API KEY MODAL
      =============================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun w-[400px] shadow-lg">

            <h2 className="text-xl font-semibold mb-3 text-accent">
              User Created Successfully 🎉
            </h2>

            <p className="text-gray-300 mb-2">Raw API Key:</p>

            <div className="bg-black/40 p-3 rounded-lg border border-metallic-gun mb-3 flex justify-between items-center">
              <span className="text-white font-mono break-all">{newApiKey}</span>
              <button onClick={copyKey}>
                <Copy size={18} className="text-accent" />
              </button>
            </div>

            <p className="text-red-400 text-sm mb-3">
              ⚠️ Copy this key now. It will not be shown again.
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-accent text-black font-semibold px-4 py-2 rounded hover:bg-accent/80"
            >
              Done
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
