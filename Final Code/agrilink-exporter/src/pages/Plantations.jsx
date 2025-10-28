// src/pages/Plantations.jsx
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, doc, setDoc, getDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";

export default function Plantations() {
  const [harvests, setHarvests] = useState([]);
  const [toast, setToast] = useState(""); // ✅ toast message state
  const location = useLocation();
  const ownerId = location.state?.ownerId;

  useEffect(() => {
    const fetchHarvests = async () => {
      try {
        if (!ownerId) return;
        const q = query(collection(db, "harvests"), where("ownerId", "==", ownerId));
        const snap = await getDocs(q);
        const availableHarvests = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((h) => !h.status || h.status.toLowerCase() !== "sold");
        setHarvests(availableHarvests);
      } catch (err) {
        console.error("Error fetching harvests:", err);
      }
    };
    fetchHarvests();
  }, [ownerId]);

  const handleAddToBasket = async (harvest) => {
    try {
      const exporterId = auth.currentUser?.uid;
      if (!exporterId) return console.log("You must be logged in as an exporter.");

      const basketRef = doc(db, `baskets/${exporterId}/items/${harvest.id}`);
      const basketSnap = await getDoc(basketRef);

      if (basketSnap.exists()) {
        setToast("Item already in your basket!");
        setTimeout(() => setToast(""), 2500);
        return;
      }

      await setDoc(basketRef, {
        harvestId: harvest.id,
        crop: harvest.crop,
        quantity: harvest.quantity,
        grade: harvest.grade,
        price: harvest.price,
        ownerId: harvest.ownerId,
        fieldLocation: harvest.fieldLocation,
        imageUrl: harvest.imageUrl || "",
        status: harvest.status || "Available",
        addedAt: new Date(),
      });

      console.log(`${harvest.crop} added to basket successfully`);
      setToast(`${harvest.crop} added to basket ✅`);
      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      console.error("Error adding to basket:", err);
      setToast("Failed to add item. Try again.");
      setTimeout(() => setToast(""), 2500);
    }
  };

  return (
    <div className="flex bg-blue-50 min-h-screen relative">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar />
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          Available Harvests
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {harvests.map((h) => (
            <div
              key={h.id}
              className="bg-white border border-blue-100 rounded-2xl shadow-sm p-4 transition hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-1">{h.crop}</h3>
              <p className="text-sm text-gray-600">Quantity: {h.quantity} kg</p>
              <p className="text-sm text-gray-600">Grade: {h.grade}</p>
              <p className="text-sm text-gray-600">
                Field: {h.fieldLocation || "N/A"}
              </p>
              <p className="text-sm text-gray-800 font-semibold mt-1">
                Price: Rs {h.price ? h.price.toLocaleString() : "N/A"} per kg
              </p>

              {h.imageUrl && (
                <img
                  src={h.imageUrl}
                  alt="harvest"
                  className="w-full h-40 object-cover rounded-md mt-3"
                />
              )}

              <p className="mt-2 text-xs text-gray-400">
                Status: {h.status || "Available"}
              </p>

              <button
                onClick={() => handleAddToBasket(h)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all duration-300"
              >
                Add to Basket
              </button>
            </div>
          ))}

          {harvests.length === 0 && (
            <p className="text-gray-500 text-sm">No available harvests.</p>
          )}
        </div>
      </main>

      {/* ✅ Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeInOut">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ✅ Optional: Add this animation in your global CSS (e.g., index.css)
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(20px); }
  10%, 90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(20px); }
}
.animate-fadeInOut {
  animation: fadeInOut 2.5s ease-in-out forwards;
}
*/
