import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import PlantationCard from "../components/PlantationCard";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { Leaf, Package, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ added for navigation

export default function Dashboard() {
  const [plantations, setPlantations] = useState([]);
  const [pendingDealsCount, setPendingDealsCount] = useState(0);
  const [shipments, setShipments] = useState([]);
  const navigate = useNavigate(); // ✅ navigation hook

  // 🌿 Load plantations
  useEffect(() => {
    const fetchPlantations = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "owner"));
        const plantSnap = await getDocs(q);
        const owners = plantSnap.docs.map((doc) => ({
          id: doc.id,
          ownerId: doc.data().ownerId,
          ...doc.data(),
        }));
        setPlantations(owners);
      } catch (err) {
        console.error("Error fetching plantations:", err);
      }
    };
    fetchPlantations();
  }, []);

  // 📦 Real-time pending deals count
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "deals"),
      where("exporterId", "==", user.uid),
      where("status", "in", ["Pending", "Counter"])
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setPendingDealsCount(snapshot.size); // realtime update
    });

    return () => unsub();
  }, []);

  // 🚚 Load shipments (only for logged-in exporter)
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const q = query(
          collection(db, "shipments"),
          where("exporterId", "==", user.uid)
        );
        const snap = await getDocs(q);
        setShipments(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching shipments:", err);
      }
    };
    fetchShipments();
  }, []);

  return (
    <Layout exporterName="Global Exports Ltd.">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatsCard
          icon={<Leaf />}
          title="Available Plantations"
          value={plantations.length}
        />
        <StatsCard
          icon={<Package />}
          title="Pending Deals"
          value={pendingDealsCount}
        />
        <div onClick={() => navigate("/shipments")} className="cursor-pointer">
          <StatsCard
            icon={<TrendingUp />}
            title="Total Shipments"
            value={shipments.length}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-blue-700 mb-3">
        Browse Plantations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plantations.map((p) => (
          <PlantationCard
            key={p.id}
            plantation={{
              id: p.id,
              ownerId: p.ownerId,
              name: p.plantationName,
              location: p.location,
              crops: p.cropTypes,
            }}
          />
        ))}

        {plantations.length === 0 && (
          <p className="text-gray-500 text-sm">No plantations available yet.</p>
        )}
      </div>
    </Layout>
  );
}
