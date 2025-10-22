import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", shipments: 4, profit: 12000 },
  { month: "Feb", shipments: 6, profit: 15000 },
  { month: "Mar", shipments: 8, profit: 21000 },
  { month: "Apr", shipments: 5, profit: 16000 },
];

export default function Reports() {
  return (
    <div className="flex bg-blue-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar exporterName="Global Exports Ltd." />
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          Reports & Analytics
        </h2>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">
            Monthly Shipments
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="shipments" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
