import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ShipmentCard from "../components/ShipmentCard";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Shipments() {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const fetchShipments = async () => {
      const snapshot = await getDocs(collection(db, "shipments"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setShipments(list);
    };
    fetchShipments();
  }, []);

  return (
    <div className="flex bg-blue-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar exporterName="Global Exports Ltd." />
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Shipments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shipments.map((s) => (
            <ShipmentCard key={s.id} shipment={s} />
          ))}
        </div>
      </main>
    </div>
  );
}
