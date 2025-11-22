import "../Shimmer/shimmer.css";

export default function ShimmerLine({ width = "100%", height = "16px" }) {
  return (
    <div
      className="shimmer rounded my-1"
      style={{ width, height }}
    ></div>
  );
}
