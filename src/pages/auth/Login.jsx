import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";

export default function Login() {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!apiKey.trim()) {
      setError("API key is required.");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      console.log("Saving Admin Key:", apiKey);

      localStorage.setItem("admin_api_key", apiKey);

      // IMPORTANT: Hard reload to ensure axios loads the key
      window.location.href = "/dashboard";
    }, 400);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="p-10 bg-gray-900 rounded-xl w-full max-w-md">
        <div className="flex justify-center mb-4">
          <ShieldCheck size={48} className="text-accent" />
        </div>

        <h1 className="text-3xl font-bold text-center mb-6">
          Admin Console
        </h1>

        <div className="mb-5">
          <label className="text-gray-300 text-sm mb-1 block">
            Admin API Key
          </label>
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
          className="w-full py-3 bg-accent text-black rounded-lg font-semibold"
        >
          {loading ? "Authenticating..." : "Login"}
        </button>

        {error && <p className="text-red-400 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}
