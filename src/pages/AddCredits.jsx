// src/pages/AddCredits.jsx
import { useState, useEffect } from "react";
import api from "../api/admin.js";
import Loader from "../components/Loader/loader.jsx";
import { UserPlus, Plus } from "lucide-react";

export default function AddCredits() {
  const [username, setUsername] = useState("");
  const [credits, setCredits] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/v1/admin/users");
        setUsers(res.data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleAddCredits = async () => {
    if (!userId) return alert("❌ Please select a user from suggestions!");

    if (!credits || Number(credits) <= 0)
      return alert("❌ Credits must be a positive number.");

    setLoading(true);

    try {
      await api.post("/v1/admin/add-credits", {
        user_id: userId,
        credits: Number(credits),
      });

      alert("✅ Credits added successfully!");

      setUsername("");
      setCredits("");
      setUserId(null);
      setRole("");

    } catch (e) {
      console.error(e);
      alert("❌ Failed to add credits");
    }

    setLoading(false);
  };

  // Filter users for suggestions
  const suggestions = users
    .filter((u) =>
      u.username?.toLowerCase().includes(username.toLowerCase())
    )
    .slice(0, 6);

  const roleColor = (r) => {
    if (r === "admin") return "text-red-400";
    if (r === "sub_admin") return "text-yellow-300";
    return "text-blue-300";
  };

  return (
    <div className="space-y-6 px-2 md:px-6">
      <h1 className="text-2xl font-bold">Add Credits</h1>

      <div className="max-w-2xl mx-auto bg-metallic-plate p-6 rounded-xl border border-metallic-gun shadow-md relative">

        {loading && (
          <div className="absolute inset-0 bg-black/50 z-40 flex items-center justify-center">
            <Loader />
          </div>
        )}

        {/* USERNAME FIELD */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Select User</label>

          <div className="relative">
            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setSuggestOpen(true);
              }}
              placeholder="Type username..."
              className="w-full p-3 rounded bg-black/40 border border-metallic-gun text-white"
            />

            {suggestOpen && username && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-metallic-dark border border-metallic-gun rounded max-h-44 overflow-auto z-50 shadow-xl">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setUsername(s.username);
                      setUserId(s.id);
                      setRole(s.role);
                      setSuggestOpen(false);
                    }}
                    className="px-3 py-2 hover:bg-metallic-plate cursor-pointer flex justify-between"
                  >
                    <span>{s.username}</span>
                    <span className={`text-xs ${roleColor(s.role)}`}>
                      {s.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {role && (
            <div className="text-sm mt-2">
              Role: <span className={roleColor(role)}>{role}</span>
            </div>
          )}
        </div>

        {/* CREDITS FIELD */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Credits Amount</label>
          <input
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            type="number"
            placeholder="Amount to add"
            className="w-full p-3 rounded bg-black/40 border border-metallic-gun text-white"
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={handleAddCredits}
            className="px-4 py-2 bg-accent text-black rounded font-semibold flex items-center gap-2"
          >
            <Plus size={16} /> Add Credits
          </button>

          <button
            onClick={() => {
              setUsername("");
              setCredits("");
              setUserId(null);
              setRole("");
            }}
            className="px-4 py-2 bg-metallic-dark text-accent rounded"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Quick Credit Range Info */}
      <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded bg-red-500/10 text-red-400 border border-red-500/20">
          Critical &lt; 50
        </div>
        <div className="p-3 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
          Low 50–500
        </div>
        <div className="p-3 rounded bg-green-500/10 text-green-400 border border-green-500/20">
          Healthy 500–1000
        </div>
        <div className="p-3 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
          VIP &gt; 1000
        </div>
      </div>
    </div>
  );
}
