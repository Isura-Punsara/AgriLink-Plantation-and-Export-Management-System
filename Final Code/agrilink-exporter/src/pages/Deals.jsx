import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Deals() {
  const [basketItems, setBasketItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [counterPrice, setCounterPrice] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBasketItems = async () => {
      try {
        const exporterId = auth.currentUser?.uid;
        if (!exporterId) return;
        const basketRef = collection(db, `baskets/${exporterId}/items`);
        const snap = await getDocs(basketRef);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setBasketItems(items);
      } catch (err) {
        console.error("Error fetching basket:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBasketItems();
  }, []);

  const handleRemove = async (itemId) => {
    const exporterId = auth.currentUser?.uid;
    if (!exporterId) return;
    await deleteDoc(doc(db, `baskets/${exporterId}/items`, itemId));
    setBasketItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleNegotiate = (item) => {
    setSelectedItem(item);
    setCounterPrice(item?.price || "");
    setShowForm(true);
  };

  const handleSubmitCounter = async (e) => {
    e.preventDefault();
    try {
      const exporterId = auth.currentUser?.uid;
      if (!exporterId || !selectedItem) return;

      let exporterName = auth.currentUser?.email || "Exporter";
      const expSnap = await getDoc(doc(db, "exporters", exporterId));
      if (expSnap.exists()) {
        const d = expSnap.data();
        exporterName = d.companyName || d.email || exporterName;
      }

      await addDoc(collection(db, "deals"), {
        ownerId: selectedItem.ownerId,
        exporterId,
        exporter: exporterName,
        harvestId: selectedItem.harvestId || selectedItem.id,
        crop: selectedItem.crop,
        quantity: selectedItem.quantity,
        suggestedPrice: Number(counterPrice),
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      await deleteDoc(doc(db, `baskets/${exporterId}/items`, selectedItem.id));
      setBasketItems((prev) => prev.filter((i) => i.id !== selectedItem.id));

      setShowForm(false);
      setSelectedItem(null);
      setCounterPrice("");
      navigate("/pending-deals");
    } catch (err) {
      console.error("Failed to send negotiation:", err);
    }
  };

  const sendNotification = async (recipientId, message, dealId) => {
    if (!recipientId) return;
    await addDoc(collection(db, "notifications"), {
      recipientId,
      message,
      type: "deal",
      dealId: dealId || null,
      createdAt: serverTimestamp(),
      read: false,
    });
  };

  const handleBuy = async (item) => {
    try {
      const exporterId = auth.currentUser?.uid;
      if (!exporterId) return;

      let exporterName = auth.currentUser?.email || "Exporter";
      const expSnap = await getDoc(doc(db, "exporters", exporterId));
      if (expSnap.exists()) {
        const d = expSnap.data();
        exporterName = d.companyName || d.email || exporterName;
      }

      const accepted = Number(item.price || 0);

      const dealRef = await addDoc(collection(db, "deals"), {
        ownerId: item.ownerId,
        exporterId,
        exporter: exporterName,
        harvestId: item.harvestId || item.id,
        crop: item.crop,
        quantity: item.quantity,
        suggestedPrice: accepted,
        acceptedPrice: accepted,
        lastBy: "exporter",
        status: "Accepted",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      if (item.harvestId || item.id) {
        await updateDoc(doc(db, "harvests", item.harvestId || item.id), {
          status: "Sold",
          price: accepted,
          soldAt: serverTimestamp(),
        });
      }

      // ✅ Create shipment record
      await addDoc(collection(db, "shipments"), {
        dealId: dealRef.id,
        exporterId,
        exporter: exporterName,
        ownerId: item.ownerId,
        crop: item.crop,
        quantity: item.quantity,
        price: accepted,
        status: "In Transit",
        createdAt: serverTimestamp(),
      });

      await deleteDoc(doc(db, `baskets/${exporterId}/items`, item.id));
      setBasketItems((prev) => prev.filter((i) => i.id !== item.id));

      await sendNotification(
        item.ownerId,
        `🛒 The exporter bought your ${item.crop} batch for Rs ${accepted}.`,
        dealRef.id
      );
    } catch (err) {
      console.error("Buy failed:", err);
    }
  };

  if (loading)
    return (
      <Layout>
        <p className="text-gray-500">Loading your basket...</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Your Basket</h2>
        <button
          onClick={() => navigate("/pending-deals")}
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md"
        >
          Pending Deals
        </button>
      </div>

      {basketItems.length === 0 ? (
        <p className="text-gray-500 text-sm">
          Your basket is empty. Add harvests from Plantations.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {basketItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-blue-100 rounded-2xl shadow-sm p-4 transition hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-1">
                {item.crop}
              </h3>
              <p className="text-sm text-gray-600">
                Quantity: {item.quantity} kg
              </p>
              <p className="text-sm text-gray-600">
                Price: Rs {item.price} per kg
              </p>

              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt="Harvest"
                  className="w-full h-40 object-cover rounded-md mt-3"
                />
              )}

              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => handleNegotiate(item)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md"
                >
                  Negotiate
                </button>

                <button
                  onClick={() => handleBuy(item)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
                >
                  Buy
                </button>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmitCounter}
            className="bg-white rounded-2xl shadow-lg p-6 w-96"
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              Counter Offer — {selectedItem?.crop}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Quantity: {selectedItem?.quantity} kg
            </p>
            <input
              type="number"
              step="0.01"
              min="0"
              value={counterPrice}
              onChange={(e) => setCounterPrice(e.target.value)}
              placeholder="Enter your counter price"
              className="border rounded-md p-2 w-full mb-4"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedItem(null);
                  setCounterPrice("");
                }}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
