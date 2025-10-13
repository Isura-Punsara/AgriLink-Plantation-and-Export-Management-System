import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

export default function Reports() {
  const [harvestData, setHarvestData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const snap = await getDocs(collection(db, "harvests"));
      const data = {};
      snap.forEach((doc) => {
        const h = doc.data();
        data[h.crop] = (data[h.crop] || 0) + h.quantity;
      });
      setHarvestData(
        Object.keys(data).map((crop) => ({ crop, quantity: data[crop] }))
      );
    }
    loadData();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("AgriLink - Harvest Report", 10, 10);
    harvestData.forEach((h, i) =>
      doc.text(`${h.crop}: ${h.quantity} kg`, 10, 20 + i * 10)
    );
    doc.save("HarvestReport.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(harvestData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "HarvestReport.xlsx");
  };

  return (
    <div className="p-6 bg-gradient-to-b from-green-50 to-white min-h-screen">
      <h1 className="text-2xl font-semibold text-green-700 mb-4">
        Reports & Analytics
      </h1>

      <div className="bg-white p-4 rounded-2xl shadow-md">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={harvestData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="crop" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={harvestData}>
            <XAxis dataKey="crop" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="quantity"
              stroke="#22c55e"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={exportPDF}
            className="bg-green-600 text-white px-3 py-2 rounded-md"
          >
            PDF
          </button>
          <button
            onClick={exportExcel}
            className="bg-emerald-500 text-white px-3 py-2 rounded-md"
          >
            Excel
          </button>
        </div>
      </div>
    </div>
  );
}
