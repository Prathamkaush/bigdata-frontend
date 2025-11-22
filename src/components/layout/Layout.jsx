import Sidebar from "./SideBar.jsx";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-metallic-dark text-white">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
