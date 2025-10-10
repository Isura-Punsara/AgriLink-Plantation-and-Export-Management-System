import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function DealRequests() {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDeals() {
      const snap = await getDocs(collection(db, "deals"));
      setDeals(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    loadDeals();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-b from-green-50 to-white min-h-screen">
      <h1 className="text-2xl font-semibold text-green-700 mb-4">
        Deal Requests
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
              Suggested Price: Rs {deal.suggestedPrice}
            </p>
            <button
              onClick={() => navigate(`/deal/${deal.id}`)}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
