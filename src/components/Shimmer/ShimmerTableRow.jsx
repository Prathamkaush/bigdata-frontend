import "../Shimmer/shimmer.css";

export default function ShimmerTableRow({ columns = 5 }) {
  return (
    <tr className="animate-none">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="p-3">
          <div className="h-5 w-full shimmer rounded"></div>
        </td>
      ))}
    </tr>
  );
}
