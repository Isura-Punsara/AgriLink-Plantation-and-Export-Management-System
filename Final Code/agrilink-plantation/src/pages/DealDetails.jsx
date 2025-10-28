import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function DealDetails() {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const ref = doc(db, "deals", id);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setDeal({ id: snap.id, ...d });
          setPrice(String(d.suggestedPrice ?? ""));
        }
      },
      (err) => console.error("DealDetails listener error:", err)
    );
    return () => unsub && unsub();
  }, [id]);

  const sendNotification = async (recipientId, message) => {
    if (!recipientId) return;
    await addDoc(collection(db, "notifications"), {
      recipientId,
      message,
      type: "deal",
      dealId: id,
      createdAt: serverTimestamp(),
      read: false,
    });
  };

  const handleAccept = async () => {
    try {
      const accepted =
        Number.isFinite(Number(price)) && Number(price) > 0
          ? Number(price)
          : Number(deal.suggestedPrice || 0);

      const ref = doc(db, "deals", id);
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

      // ✅ Create shipment record when owner accepts
      await addDoc(collection(db, "shipments"), {
        dealId: id,
        exporterId: deal.exporterId,
        ownerId: deal.ownerId,
        crop: deal.crop,
        quantity: deal.quantity,
        price: accepted,
        status: "In Transit",
        createdAt: serverTimestamp(),
      });

      await Promise.all([
        sendNotification(
          deal.exporterId,
          `✅ Your deal for ${deal.crop} has been accepted by the plantation owner.`
        ),
        sendNotification(deal.ownerId, `You accepted the deal for ${deal.crop}.`),
      ]);

      navigate("/deals/confirmed");
    } catch (e) {
      console.error("Accept failed:", e);
    }
  };

  const handleReject = async () => {
    try {
      const ref = doc(db, "deals", id);
      await updateDoc(ref, {
        status: "Rejected",
        updatedAt: serverTimestamp(),
      });

      await Promise.all([
        sendNotification(
          deal.exporterId,
          `❌ Your deal for ${deal.crop} was rejected by the plantation owner.`
        ),
        sendNotification(deal.ownerId, `You rejected the deal for ${deal.crop}.`),
      ]);

      navigate("/deals/requests");
    } catch (e) {
      console.error("Reject failed:", e);
    }
  };

  const handleCounter = async () => {
    try {
      const p = Number(price);
      if (Number.isNaN(p) || p <= 0) return;

      const ref = doc(db, "deals", id);
      await updateDoc(ref, {
        ownerOffer: p,
        suggestedPrice: p,
        lastBy: "owner",
        status: "Counter",
        updatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "deals", id, "negotiations"), {
        by: "owner",
        price: p,
        at: serverTimestamp(),
      });

      await Promise.all([
        sendNotification(
          deal.exporterId,
          `↔️ The plantation owner sent a new counter offer for ${deal.crop}: Rs ${p}`
        ),
        sendNotification(
          deal.ownerId,
          `You sent a counter offer for ${deal.crop} (Rs ${p}).`
        ),
      ]);
    } catch (e) {
      console.error("Counter failed:", e);
    }
  };

  if (!deal)
    return (
      <Layout>
        <p className="p-6">Loading...</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
          <h2 className="text-2xl font-semibold mb-3 text-green-700">
            {deal.crop}
          </h2>

          <div className="text-sm text-gray-700 space-y-1 mb-4">
            <p>Exporter: {deal.exporter}</p>
            <p>Quantity: {deal.quantity} kg</p>
            <p>Exporter&apos;s last: <b>Rs {deal.exporterOffer ?? "-"}</b></p>
            <p>Owner&apos;s last: <b>Rs {deal.ownerOffer ?? "-"}</b></p>
            <p className="text-gray-500">
              Latest (shown to both): <b>Rs {deal.suggestedPrice ?? "-"}</b>
            </p>
            <p className="text-gray-500">
              Status: {deal.status} | Last by: {deal.lastBy || "-"}
            </p>
          </div>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded-md p-2 w-full mb-4"
            placeholder="Confirm or Edit Price"
            min="0"
            step="0.01"
          />

          <div className="flex justify-between">
            <button
              onClick={handleAccept}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Accept
            </button>
            <button
              onClick={handleReject}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Reject
            </button>
            <button
              onClick={handleCounter}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            >
              Counter
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
