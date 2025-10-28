import Layout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import ActivityFeed from "../components/ActivityFeed";
import { Leaf, Handshake, DollarSign } from "lucide-react"; // 🔹 Removed Bell import
import {
  collection,
  query,
  where,
  getCountFromServer,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    stock: 0,
    pendingDeals: 0,
    revenue: 0,
  }); // 🔹 Removed notifications from state
  const [activity, setActivity] = useState([]);
  const [role, setRole] = useState("owner");

  useEffect(() => {
    async function load() {
      const user = auth.currentUser;
      if (!user) return;

      let ownerId = user.uid;
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) {
        const u = userSnap.data();
        setRole(u.role || "owner");
        ownerId = u.role === "worker" ? u.ownerId : user.uid;
      }

      // 🟢 Batches in stock
      const qStock = query(
        collection(db, "harvests"),
        where("status", "==", "Available"),
        where("ownerId", "==", ownerId)
      );
      const stockSnap = await getCountFromServer(qStock);

      // 🟢 Pending + Counter deals
      const qDeals = query(
        collection(db, "deals"),
        where("ownerId", "==", ownerId)
      );
      const dealsSnap = await getDocs(qDeals);
      const pendingCount = dealsSnap.docs.filter((d) => {
        const status = d.data().status;
        return status === "Pending" || status === "Counter";
      }).length;

      // 🟢 Revenue (this month)
      const qRevenue = query(
        collection(db, "harvests"),
        where("status", "==", "Sold"),
        where("ownerId", "==", ownerId)
      );
      const soldSnap = await getDocs(qRevenue);
      let totalRevenue = 0;

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      soldSnap.forEach((docu) => {
        const h = docu.data();
        if (!h.createdAt || !h.price || !h.quantity) return;
        const createdDate = h.createdAt.toDate ? h.createdAt.toDate() : new Date(h.createdAt);
        if (createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear) {
          totalRevenue += (Number(h.price) || 0) * (Number(h.quantity) || 0);
        }
      });

      // 🟢 Recent activity
      const recent = [];
      const qRecentHarvests = query(
        collection(db, "harvests"),
        where("ownerId", "==", ownerId),
        orderBy("createdAt", "desc"),
        limit(3)
      );
      const qRecentDeals = query(
        collection(db, "deals"),
        where("ownerId", "==", ownerId),
        orderBy("createdAt", "desc"),
        limit(2)
      );
      const [hSnap, dSnap] = await Promise.all([getDocs(qRecentHarvests), getDocs(qRecentDeals)]);

      hSnap.forEach((docu) =>
        recent.push({
          title: `New harvest: ${docu.data().crop}`,
          subtitle: `${docu.data().quantity} kg`,
          time: "Just now",
        })
      );
      dSnap.forEach((docu) =>
        recent.push({
          title: `Deal update: ${docu.data().batchId || "Batch"}`,
          subtitle: docu.data().status,
          time: "Recently",
        })
      );

      setStats({
        stock: stockSnap.data().count,
        pendingDeals: pendingCount,
        revenue: totalRevenue,
      });
      setActivity(recent);
    }
    load();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Hide cards for workers */}
        {role !== "worker" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 🔹 Removed Notifications card */}
            <StatsCard icon={Leaf} label="Batches in Stock" value={stats.stock} />
            <StatsCard icon={Handshake} label="Pending Deals" value={stats.pendingDeals} />
            <StatsCard
              icon={DollarSign}
              label="Revenue (This Month)"
              value={`Rs ${stats.revenue.toLocaleString()}`}
            />
          </div>
        )}
        <ActivityFeed items={activity} />
      </div>
    </Layout>
  );
}
