import "../Shimmer/shimmer.css";

export default function ShimmerAvatar({ size = 48 }) {
  return (
    <div
      className="shimmer rounded-full"
      style={{ width: size, height: size }}
    ></div>
  );
}
