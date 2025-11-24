export default function StatCard({ title, value }) {
  return (
    <div className="bg-metallic-plate p-5 rounded-xl border border-metallic-gun shadow-sm">
      <h3 className="text-md text-gray-300">{title}</h3>
      <div className="text-3xl font-bold mt-2 text-white">{value ?? "—"}</div>
    </div>
  );
}
