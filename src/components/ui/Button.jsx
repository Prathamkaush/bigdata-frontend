export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 font-semibold rounded bg-accent text-black hover:bg-white transition ${className}`}
    >
      {children}
    </button>
  );
}
