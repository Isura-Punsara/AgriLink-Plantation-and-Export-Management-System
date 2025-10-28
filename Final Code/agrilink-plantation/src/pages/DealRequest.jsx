import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function DealRequests() {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let unsub;
    (async () => {
      const user = auth.currentUser;
      if (!user) return;

      let ownerId = user.uid;
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) {
        const u = userSnap.data();
        ownerId = u.role === "worker" ? u.ownerId : user.uid;
      }

      const q = query(collection(db, "deals"), where("ownerId", "==", ownerId));
      unsub = onSnapshot(
        q,
        (snap) => {
          const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          // Only show Pending / Counter to keep list clean
          const filtered = all.filter(
            (d) => d.status === "Pending" || d.status === "Counter"
          );
          setDeals(filtered);
        },
        (err) => console.error("DealRequests listener error:", err)
      );
    })();

    return () => unsub && unsub();
  }, []);

  return (
    <Layout>
      <div className="p-2 min-h-[calc(100vh-180px)]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-green-700">
            Deal Requests
          </h1>
          {/* ✅ Added button to navigate to confirmed deals */}
          <button
            onClick={() => navigate("/deals/confirmed")}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
          >
            View Confirmed Deals
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white p-4 rounded-2xl shadow-md border"
            >
              <h3 className="text-lg font-semibold text-green-700">
                {deal.crop}
              </h3>

              <p className="text-sm text-gray-600">Exporter: {deal.exporter}</p>

              <p className="text-sm text-gray-600">
                Latest Offer: Rs {deal.suggestedPrice}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Last by: {deal.lastBy || "-"} | Status: {deal.status}
              </p>

              <button
                onClick={() => navigate(`/deals/${deal.id}`)}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
              >
                View Details
              </button>
            </div>
          ))}

          {deals.length === 0 && (
            <p className="text-sm text-gray-500">No deal requests yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
