import { useState } from "react";
import api from "../api/admin.js"; // IMPORTANT: your axios instance
import { KeyRound, ShieldCheck } from "lucide-react";

export default function Login() {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // SHA256 helper (browser-native)
  const hashKey = async (key) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleLogin = async () => {
    if (!apiKey.trim()) {
      setError("API key is required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 1️⃣ Hash the key before sending
      const hashed = await hashKey(apiKey);

      // 2️⃣ Send request to backend for validation
      const res = await api.post("/v1/admin/verify-key", {
        hash: hashed,
      });

      if (res.data?.valid) {
        // 3️⃣ Save PLAINTEXT key (your API uses plaintext for headers)
        localStorage.setItem("admin_api_key", apiKey);

        window.location.href = "/dashboard";
      } else {
        setError("Invalid API Key.");
      }
    } catch (err) {
      console.log(err);
      setError("Authentication failed. Invalid API Key.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white p-4">
      <div className="p-10 bg-gray-900 rounded-xl w-full max-w-md shadow-xl border border-gray-800">

        <div className="flex justify-center mb-4">
          <ShieldCheck size={48} className="text-accent" />
        </div>

        <h1 className="text-3xl font-bold text-center mb-6">
          Admin Console
        </h1>

        <div className="mb-5">
          <label className="text-gray-300 text-sm mb-1 block">Admin API Key</label>

          <div className="flex items-center bg-black p-3 rounded-lg border border-gray-700">
            <KeyRound size={18} className="text-gray-400 mr-2" />
            <input
              className="bg-transparent flex-1 outline-none text-white"
              placeholder="Enter admin API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 bg-accent text-black rounded-lg font-semibold hover:bg-white transition disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Login"}
        </button>

        {error && <p className="text-red-400 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}
