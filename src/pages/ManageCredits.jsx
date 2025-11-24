// src/pages/ManageCredits.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../api/admin.js";
import Loader from "../components/Loader/loader.jsx";
import { Search } from "lucide-react";

export default function ManageCredits() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [sortCredits, setSortCredits] = useState("none");
  const [page, setPage] = useState(1);
  const perPage = 9;

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v1/admin/users");
      setUsers(res.data || []);
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => setLoading(false), 200);
  };

  // helpers
  const tierOf = (c) => {
    if (c < 50) return "critical";
    if (c < 500) return "low";
    if (c <= 1000) return "healthy";
    return "vip";
  };

  const colorClass = (c) => {
    if (c < 50) return "border-red-500/30 bg-red-500/5";
    if (c < 500) return "border-yellow-500/30 bg-yellow-500/5";
    if (c <= 1000) return "border-green-500/30 bg-green-500/5";
    return "border-amber-400/30 bg-amber-500/5";
  };

  // derived list (filter + sort)
  const processed = useMemo(() => {
    let list = [...users];
    if (query.trim()) {
      list = list.filter(u => u.username?.toLowerCase().includes(query.toLowerCase()));
    }
    if (roleFilter !== "all") list = list.filter(u => u.role === roleFilter);
    if (tierFilter !== "all") list = list.filter(u => tierOf(u.credits) === tierFilter);

    if (sortCredits === "asc") list.sort((a,b)=>a.credits-b.credits);
    if (sortCredits === "desc") list.sort((a,b)=>b.credits-a.credits);

    return list;
  }, [users, query, roleFilter, tierFilter, sortCredits]);

  const totalPages = Math.max(1, Math.ceil(processed.length / perPage));
  const paginated = processed.slice((page-1)*perPage, page*perPage);

  return (
    <div className="space-y-6 px-2 md:px-6">
      <h1 className="text-2xl font-bold">Credits Overview</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-metallic-plate border border-metallic-gun">
          <div className="text-sm text-gray-400">Total Users</div>
          <div className="text-2xl font-bold">{users.length}</div>
        </div>
        <div className="p-4 rounded-lg bg-metallic-plate border border-metallic-gun">
          <div className="text-sm text-gray-400">Total Credits</div>
          <div className="text-2xl font-bold">{users.reduce((s,u)=>s+(u.credits||0),0)}</div>
        </div>
        <div className="p-4 rounded-lg bg-metallic-plate border border-metallic-gun">
          <div className="text-sm text-gray-400">Low Balance (&lt;50)</div>
          <div className="text-2xl font-bold">{users.filter(u=>u.credits<50).length}</div>
        </div>
        <div className="p-4 rounded-lg bg-metallic-plate border border-metallic-gun">
          <div className="text-sm text-gray-400">VIP (&gt;1000)</div>
          <div className="text-2xl font-bold">{users.filter(u=>u.credits>1000).length}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex gap-2 items-center w-full md:w-1/2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input value={query} onChange={(e)=>{ setQuery(e.target.value); setPage(1); }} placeholder="Search username..." className="w-full pl-10 p-3 rounded bg-black/40 border border-metallic-gun text-white" />
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <select value={roleFilter} onChange={(e)=>{ setRoleFilter(e.target.value); setPage(1); }} className="p-2 bg-black/40 border border-metallic-gun text-white rounded">
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admin</option>
          </select>

          <select value={tierFilter} onChange={(e)=>{ setTierFilter(e.target.value); setPage(1); }} className="p-2 bg-black/40 border border-metallic-gun text-white rounded">
            <option value="all">All Tiers</option>
            <option value="critical">Critical &lt;50</option>
            <option value="low">Low 50-500</option>
            <option value="healthy">Healthy 500-1000</option>
            <option value="vip">VIP &gt;1000</option>
          </select>

          <select value={sortCredits} onChange={(e)=>{ setSortCredits(e.target.value); setPage(1); }} className="p-2 bg-black/40 border border-metallic-gun text-white rounded">
            <option value="none">Sort</option>
            <option value="asc">Credits Low → High</option>
            <option value="desc">Credits High → Low</option>
          </select>
        </div>
      </div>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          [...Array(perPage)].map((_,i)=>(
            <div key={i} className="p-4 rounded-lg bg-metallic-plate border border-metallic-gun animate-pulse h-36" />
          ))
        ) : paginated.length === 0 ? (
          <div className="col-span-full text-gray-400">No users found.</div>
        ) : paginated.map(u=>(
          <div key={u.id} className={`p-4 rounded-lg ${colorClass(u.credits)} border`}>
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="text-lg font-semibold">{u.username}</div>
                <div className="text-sm text-gray-400">ID: {u.id} • {u.role}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Credits</div>
                <div className="text-2xl font-bold">{u.credits}</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="text-sm text-gray-400">
                Created: {new Date(u.created_at).toLocaleDateString()}
              </div>

              <div className="flex gap-2">
                <button onClick={()=>window.location.href=`/users/${u.id}`} className="px-3 py-1 bg-metallic-dark text-accent rounded">View</button>
                <button onClick={async ()=>{
                  const amount = parseInt(prompt("Add credits amount (positive integer)"),10);
                  if (!amount || amount<=0) return;
                  try {
                    await api.post("/v1/admin/add-credits", { username: u.username, credits: amount });
                    fetchUsers();
                  } catch(e){ alert("Failed"); }
                }} className="px-3 py-1 bg-accent text-black rounded">Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="px-4 py-2 bg-metallic-dark text-accent rounded disabled:opacity-40">Prev</button>
        <div className="text-gray-300">Page {page} / {totalPages}</div>
        <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)} className="px-4 py-2 bg-metallic-dark text-accent rounded disabled:opacity-40">Next</button>
      </div>

      
    </div>
  );
}
