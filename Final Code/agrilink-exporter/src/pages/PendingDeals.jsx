import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function PendingDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [counter, setCounter] = useState("");

  useEffect(() => {
    const exporterId = auth.currentUser?.uid;
    if (!exporterId) return;

    const q = query(collection(db, "deals"), where("exporterId", "==", exporterId));
    const unsub = onSnapshot(q, (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const filtered = all
        .filter((d) => d.status === "Pending" || d.status === "Counter")
        .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setDeals(filtered);
      setLoading(false);
    });

    return () => unsub && unsub();
  }, []);

  const openModal = (deal) => {
    setOpenId(deal.id);
    setCounter(String(deal.suggestedPrice || ""));
  };
  const closeModal = () => {
    setOpenId(null);
    setCounter("");
  };

  const sendNotification = async (recipientId, message, senderType, recipientType, dealId) => {
    if (!recipientId) return;
    await addDoc(collection(db, "notifications"), {
      recipientId,
      senderType,
      recipientType,
      dealId,
      message,
      type: "deal",
      createdAt: serverTimestamp(),
      read: false,
    });
  };

  const handleAccept = async (deal) => {
    try {
      const accepted = Number(deal.suggestedPrice || 0);
      const ref = doc(db, "deals", deal.id);
      await updateDoc(ref, {
        status: "Accepted",
        acceptedPrice: accepted,
        updatedAt: serverTimestamp(),
      });

      if (deal.harvestId) {
        await updateDoc(doc(db, "harvests", deal.harvestId), {
          status: "Sold",
          price: accepted,
          soldAt: serverTimestamp(),
        });
      }

      // ✅ Create shipment record
      const exporterId = auth.currentUser?.uid;
      const expSnap = await addDoc(collection(db, "shipments"), {
        dealId: deal.id,
        exporterId,
        ownerId: deal.ownerId,
        crop: deal.crop,
        quantity: deal.quantity,
        price: accepted,
        status: "In Transit",
        createdAt: serverTimestamp(),
      });

      await sendNotification(
        deal.ownerId,
        `✅ The exporter accepted your deal for ${deal.crop}.`,
        "exporter",
        "plantation",
        deal.id
      );
      closeModal();
    } catch (e) {
      console.error("Accept failed:", e);
    }
  };

  if (loading)
    return (
      <Layout>
        <p className="text-gray-500">Loading pending deals...</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Pending Deals</h2>
      </div>

      {deals.length === 0 ? (
        <p className="text-gray-500 text-sm">No pending/counter deals.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((d) => (
            <div key={d.id} className="bg-white border border-blue-100 rounded-2xl shadow-sm p-4">
              <h3 className="text-lg font-semibold text-blue-700">{d.crop}</h3>
              <p className="text-sm text-gray-600">Quantity: {d.quantity} kg</p>
              <p className="text-sm text-gray-600 mt-1">
                Latest Offer: <b>Rs {d.suggestedPrice}</b>
              </p>
              <p className="text-xs text-gray-500 mt-1">Status: {d.status}</p>
              <button
                onClick={() => openModal(d)}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              >
                Open
              </button>

              {openId === d.id && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
                    <h4 className="text-lg font-semibold text-blue-700 mb-2">
                      Negotiate — {d.crop}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Quantity: {d.quantity} kg | Price: Rs {d.suggestedPrice}
                    </p>
                    <div className="flex justify-between gap-2">
                      <button
                        onClick={() => handleAccept(d)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
                      >
                        Accept
                      </button>
                      <button
                        onClick={closeModal}
                        className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-md hover:bg-gray-50"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
