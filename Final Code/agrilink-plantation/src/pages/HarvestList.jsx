import { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import HarvestCard from "../components/HarvestCard";
import Layout from "../components/Layout";

export default function HarvestList() {
  const [harvests, setHarvests] = useState([]);
  const navigate = useNavigate();

  const loadHarvests = async () => {
    const user = auth.currentUser;
    if (!user) return;

    let ownerId = user.uid;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const u = userDoc.data();
      ownerId = u.role === "worker" ? u.ownerId : user.uid;
    }

    const q = query(
      collection(db, "harvests"),
      where("ownerId", "==", ownerId),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);
    setHarvests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadHarvests();
  }, []);

  const handleDelete = async (id) => {
    try {
      const harvestRef = doc(db, "harvests", id);
      const harvestSnap = await getDoc(harvestRef);

      if (harvestSnap.exists()) {
        const data = harvestSnap.data();
        if (data.imageUrl) {
          const imgRef = ref(storage, data.imageUrl);
          await deleteObject(imgRef).catch((err) =>
            console.warn("Image not found:", err)
          );
        }
      }

      await deleteDoc(harvestRef);
      setHarvests((prev) => prev.filter((h) => h.id !== id));
    } catch (error) {
      console.error("Error deleting harvest:", error);
      alert("Failed to delete harvest.");
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-180px)] p-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-green-700">Harvest List</h1>
          <button
            onClick={() => navigate("/harvests/add")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Add Harvest
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {harvests.map((h) => (
            <HarvestCard
              key={h.id}
              harvest={h}
              onDelete={() => handleDelete(h.id)}
              onView={() => navigate(`/harvests/${h.id}`)}
            />
          ))}

          {harvests.length === 0 && (
            <p className="text-sm text-gray-500">No harvests yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
