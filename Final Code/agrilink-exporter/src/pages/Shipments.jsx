// src/pages/Shipments.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ShipmentCard from "../components/ShipmentCard";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Shipments() {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const q = query(
          collection(db, "shipments"),
          where("exporterId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setShipments(list);
      } catch (err) {
        console.error("Error fetching shipments:", err);
      }
    };
    fetchShipments();
  }, []);

  return (
    <Layout exporterName="Global Exports Ltd.">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Shipments</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shipments.map((s) => (
          <ShipmentCard key={s.id} shipment={s} />
        ))}
        {shipments.length === 0 && (
          <p className="text-sm text-gray-500">No shipments found.</p>
        )}
      </div>
    </Layout>
  );
}
