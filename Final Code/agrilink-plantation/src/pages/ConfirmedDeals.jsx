import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore";

export default function ConfirmedDeals() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    async function loadConfirmed() {
      const user = auth.currentUser;
      if (!user) return;

      let ownerId = user.uid;
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) {
        const u = userSnap.data();
        ownerId = u.role === "worker" ? u.ownerId : user.uid;
      }

      const q = query(
        collection(db, "deals"),
        where("ownerId", "==", ownerId),
        where("status", "in", ["Accepted", "Counter"]),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setDeals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    loadConfirmed();
  }, []);

  return (
    <Layout>
      <div className="p-2 min-h-[calc(100vh-180px)]">
        <h1 className="text-2xl font-semibold text-green-700 mb-4">
          Confirmed Deals
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white p-4 rounded-2xl shadow-md border">
              <h3 className="text-lg font-semibold text-green-700">{deal.crop}</h3>
              <p className="text-sm text-gray-600">Exporter: {deal.exporter}</p>
              <p className="text-sm text-gray-600">
                Confirmed Price: Rs {deal.confirmedPrice || deal.suggestedPrice}
              </p>
              <p className="text-xs text-gray-400 mt-2">{deal.status}</p>
            </div>
          ))}
          {deals.length === 0 && (
            <p className="text-sm text-gray-500">No confirmed/countered deals yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
