import { useState ,useEffect } from "react";
import api from "../../api/admin.js";
import { Copy, RefreshCcw, User } from "lucide-react";
import Loader from "../../components/Loader/loader.jsx"; 

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleRegenerate = async () => {
    setLoading(true);

    try {
      const res = await api.post("/v1/admin/regenerate-key");
      setApiKey(res.data.api_key);

      setMessage("API key regenerated successfully!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage("Failed to regenerate API key.");
    }

    // small delay for better shimmer feel
    setTimeout(() => setLoading(false), 300);
  };

  const logout = () => {
    localStorage.removeItem("admin_api_key");
    window.location.href = "/login";
  };

useEffect(() => {
  async function loadKey() {
    try {
      const res = await api.get("/v1/admin/api-key");
      setApiKey(res.data.api_key);
    } catch (err) {
      console.log("Error loading key", err);
    }
  }
  loadKey();
}, []);

  return (
    <div className="relative space-y-10">

      {/* 🔥 FULL SCREEN LOADER WITH SHIMMER */}
      {loading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* Page Title */}
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* API Key Section */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun shadow-xl">
        <h2 className="text-lg font-semibold mb-4">API Key</h2>

        <div className="flex items-center gap-3 bg-metallic-dark p-3 rounded-lg border border-metallic-gun shadow-inner">
          {loading ? (
            <div className="flex-1 h-7 rounded shimmer"></div>
          ) : (
            <input
              value={apiKey || "**** Hidden for security"}
              readOnly
              className="flex-1 bg-transparent text-white outline-none"
            />
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            disabled={loading}
            className="p-2 rounded bg-metallic-gun hover:bg-metallic-dark transition disabled:opacity-40"
          >
            <Copy size={18} className="text-accent" />
          </button>

          {/* Regenerate Button */}
          
        </div>

        {copied && <p className="text-green-400 mt-2">Copied to clipboard!</p>}
        {message && <p className="text-gray-300 mt-2">{message}</p>}
      </div>

      {/* Profile Section */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun">
        <h2 className="text-lg font-semibold mb-4">Admin Profile</h2>

        <div className="flex items-center gap-4">
          {loading ? (
            <>
              <div className="w-16 h-16 rounded-full shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 shimmer rounded"></div>
                <div className="h-4 w-48 shimmer rounded"></div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-metallic-gun p-4 rounded-full">
                <User size={32} className="text-accent" />
              </div>
              <div>
                <p className="text-white font-semibold">Admin User</p>
                <p className="text-gray-400 text-sm">admin@bigdata.com</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun">
        <h2 className="text-lg font-semibold mb-4">Appearance</h2>

        {loading ? (
          <div className="h-6 shimmer rounded w-48"></div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-gray-300">Dark Mode</p>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked readOnly />
              <div className="w-11 h-6 bg-metallic-gun rounded-full peer peer-checked:bg-accent transition"></div>
              <span className="ml-3 text-gray-300">Enabled</span>
            </label>
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
