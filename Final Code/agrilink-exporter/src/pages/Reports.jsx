import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { db, auth } from "../firebase";
import { collection, getDocs, where, query } from "firebase/firestore";

export default function Reports() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // get shipments belonging to this exporter
        const q = query(
          collection(db, "shipments"),
          where("exporterId", "==", user.uid)
        );
        const snap = await getDocs(q);
        const shipments = snap.docs.map((doc) => doc.data());

        // Group shipments by month using createdAt
        const monthly = {};
        shipments.forEach((s) => {
          let dateObj;
          if (s.createdAt?.toDate) {
            dateObj = s.createdAt.toDate();
          } else if (typeof s.createdAt === "string") {
            dateObj = new Date(s.createdAt);
          } else {
            dateObj = new Date();
          }

          const month = dateObj.toLocaleString("default", { month: "short" });
          if (!monthly[month]) monthly[month] = { shipments: 0, totalValue: 0 };
          monthly[month].shipments += 1;
          monthly[month].totalValue += s.price || 0;
        });

        // Convert object → array for Recharts
        const chartData = Object.keys(monthly).map((m) => ({
          month: m,
          shipments: monthly[m].shipments,
          totalValue: monthly[m].totalValue,
        }));

        setData(chartData);
      } catch (err) {
        console.error("Error loading reports:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout exporterName="Global Exports Ltd.">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Reports & Analytics
      </h2>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">
          Monthly Shipments Overview
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="shipments" fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {data.length === 0 && (
          <p className="text-gray-500 text-sm mt-4">
            No shipments data available yet.
          </p>
        )}
      </div>
    </Layout>
  );
}
