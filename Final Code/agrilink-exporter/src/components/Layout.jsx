import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div className="flex bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        {/* Topbar no longer takes exporterName as a prop */}
        <Topbar />
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
