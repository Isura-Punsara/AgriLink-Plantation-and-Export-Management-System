import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ConfirmedDeals() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    async function loadConfirmed() {
      const q = query(collection(db, "deals"), where("status", "==", "Accepted"));
      const snap = await getDocs(q);
      setDeals(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    loadConfirmed();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-b from-green-50 to-white min-h-screen">
      <h1 className="text-2xl font-semibold text-green-700 mb-4">
        Confirmed Deals
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white p-4 rounded-2xl shadow-md border"
          >
            <h3 className="text-lg font-semibold text-green-700">
              {deal.crop}
            </h3>
            <p className="text-sm text-gray-600">
              Exporter: {deal.exporter}
            </p>
            <p className="text-sm text-gray-600">
              Confirmed Price: Rs {deal.confirmedPrice}
            </p>
            <p className="text-xs text-gray-400 mt-2">{deal.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
