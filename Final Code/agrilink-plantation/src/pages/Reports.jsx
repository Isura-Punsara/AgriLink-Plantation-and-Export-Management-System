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
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import Layout from "../components/Layout";

export default function Reports() {
  const [harvestData, setHarvestData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const user = auth.currentUser;
      if (!user) return;

      let ownerId = user.uid;
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) {
        const u = userSnap.data();
        ownerId = u.role === "worker" ? u.ownerId : user.uid;
      }

      // 🔹 Fetch all harvests belonging to this owner (each harvest as a separate record)
      const q = query(collection(db, "harvests"), where("ownerId", "==", ownerId));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((d) => {
        const h = d.data();
        list.push({
          id: d.id,
          crop: h.crop || "Unknown Crop",
          quantity: Number(h.quantity) || 0,
          grade: h.grade || "-",
          harvestDate: h.harvestDate || "",
        });
      });
      setHarvestData(list);
    }
    loadData();
  }, []);

  const exportPDF = () => {
    const docx = new jsPDF();
    docx.text("AgriLink - Harvest Report", 10, 10);
    docx.text("Crop Reports:", 10, 20);
    harvestData.forEach((h, i) => {
      docx.text(`${i + 1}. ${h.crop} - ${h.quantity} kg (${h.grade})`, 10, 30 + i * 10);
    });
    docx.save("HarvestReport.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(harvestData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Harvest Report");
    XLSX.writeFile(wb, "HarvestReport.xlsx");
  };

  return (
    <Layout>
      <div className="p-2 min-h-[calc(100vh-180px)]">
        <h1 className="text-2xl font-semibold text-green-700 mb-4">Reports & Analytics</h1>

        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-green-700 mb-2">Harvest Quantity Overview</h2>

          {harvestData.length === 0 ? (
            <p className="text-gray-500 text-sm">No harvest data found.</p>
          ) : (
            <>
              {/* Bar Chart */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={harvestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>

              {/* Line Chart */}
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={harvestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="quantity" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>

              {/* Export Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={exportPDF}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md"
                >
                  Export PDF
                </button>
                <button
                  onClick={exportExcel}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-md"
                >
                  Export Excel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
