import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

export default function DealDetails() {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDeal() {
      const ref = doc(db, "deals", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        setDeal(d);
        setPrice(d.suggestedPrice);
      }
    }
    loadDeal();
  }, [id]);

  const handleConfirm = async (status) => {
    const ref = doc(db, "deals", id);
    await updateDoc(ref, { status, confirmedPrice: price });
    navigate("/confirmed-deals");
  };

  if (!deal) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-green-50 to-white">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-3 text-green-700">
          {deal.crop}
        </h2>
        <p className="text-gray-600 mb-2">Exporter: {deal.exporter}</p>
        <p className="text-gray-600 mb-4">
          Last Suggested Price: Rs {deal.suggestedPrice}
        </p>

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border rounded-md p-2 w-full mb-4"
          placeholder="Confirm or Edit Price"
        />

        <div className="flex justify-between">
          <button
            onClick={() => handleConfirm("Accepted")}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Accept
          </button>
          <button
            onClick={() => handleConfirm("Rejected")}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Reject
          </button>
          <button
            onClick={() => handleConfirm("Counter")}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
          >
            Counter
          </button>
        </div>
      </div>
    </div>
  );
}
