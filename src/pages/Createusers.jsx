import { useState } from "react";
import api from "../api/admin";
import { UserPlus } from "lucide-react";

export default function CreateRecord() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    city: "",
    state: "",
    country: "",
    source: "",
    score: 0,
  });

  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleCreate = async () => {
    if (!form.full_name) return alert("Full name is required!");

    setLoading(true);
    try {
      const res = await api.post("/v1/admin/records/create", form);
      setCreated(res.data);
      alert("Record added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add record");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <UserPlus /> Add New Record
      </h1>

      <div className="bg-metallic-plate border border-metallic-gun p-6 rounded-xl max-w-2xl space-y-4">

        {/* FULL NAME */}
        <InputField
          label="Full Name"
          value={form.full_name}
          onChange={(e) => update("full_name", e.target.value)}
        />

        {/* EMAIL */}
        <InputField
          label="Email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />

        {/* PHONE */}
        <InputField
          label="Phone"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />

        {/* GENDER + AGE */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Gender"
            value={form.gender}
            onChange={(e) => update("gender", e.target.value)}
          />
          <InputField
            label="Age"
            type="number"
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
          />
        </div>

        {/* LOCATION */}
        <h2 className="text-lg font-semibold mt-4">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="City"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />
          <InputField
            label="State"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
          />
          <InputField
            label="Country"
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
          />
        </div>

        {/* SOURCE + SCORE */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <InputField
            label="Source"
            value={form.source}
            onChange={(e) => update("source", e.target.value)}
          />
          <InputField
            label="Score"
            type="number"
            value={form.score}
            onChange={(e) => update("score", e.target.value)}
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-accent text-black font-semibold py-2 rounded-lg hover:bg-accent/90 transition"
        >
          {loading ? "Saving..." : "Add Record"}
        </button>
      </div>

      {created && (
        <div className="bg-metallic-plate border border-metallic-gun p-6 rounded-xl max-w-2xl">
          <h2 className="text-lg font-bold text-accent">Record Added!</h2>
          <p className="mt-2 text-gray-300">ID: {created.id}</p>
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <input
        type={type}
        className="w-full p-2 rounded bg-metallic-dark border border-metallic-gun text-white mt-1"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
