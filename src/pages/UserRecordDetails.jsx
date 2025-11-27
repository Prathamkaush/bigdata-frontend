import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader/loader";
import { Eye, Copy, Check } from "lucide-react";
import { fetchRecords } from "../api/records"; 

export default function UserRecordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchRecords({ id });
      setRecord(res.data?.[0] || null);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const copyId = () => {
    navigator.clipboard.writeText(record.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (loading) return <Loader />;
  if (!record) return <div className="p-6 text-white">No record found.</div>;

  const Field = ({ label, value }) => (
    <div className="mb-2">
      <div className="uppercase text-xs text-gray-400">{label}</div>
      <div className="text-white break-all">{value || "—"}</div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-metallic-dark text-accent rounded-lg"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold">User Record Details</h1>

      <div className="bg-metallic-plate p-6 rounded-xl border border-metallic-gun">

        {/* ID */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="uppercase text-xs text-gray-400">Record ID</div>
            <div className="text-white">{record.id}</div>
          </div>

          <button
            onClick={copyId}
            className="p-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            {copied ? <Check /> : <Copy />}
          </button>
        </div>

        {/* Personal */}
        <h3 className="text-lg font-semibold mb-2">Personal Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" value={record.full_name} />
          <Field label="Email" value={record.email} />
          <Field label="Phone" value={record.phone} />
          <Field label="Gender" value={record.gender} />
          <Field label="Age" value={record.age} />
        </div>

        {/* Location */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Location</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="City" value={record.city} />
          <Field label="State" value={record.state} />
          <Field label="Country" value={record.country} />
          <Field label="Zipcode" value={record.zipcode} />
        </div>

        {/* Metadata */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Extra Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Source" value={record.source} />
          <Field label="Score" value={record.score} />
          <Field label="Dedupe Key" value={record.dedupe_key} />
        </div>

        {/* Raw JSON */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Raw Data</h3>
        <pre className="bg-black/40 p-3 rounded text-xs text-gray-300 overflow-x-auto">
          {record.raw_data}
        </pre>
      </div>
    </div>
  );
}
