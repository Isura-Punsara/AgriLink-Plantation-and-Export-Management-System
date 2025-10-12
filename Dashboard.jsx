import Sidebar from "../components/Sidebar";
 import Topbar from "../components/Topbar";
 import StatsCard from "../components/StatsCard";
 import ActivityFeed from "../components/ActivityFeed";
 import { Leaf, Handshake, DollarSign, Bell } from "lucide-react";
 import { collection, query, where, getCountFromServer, orderBy, limit, getDocs } from "firebase/firestore";
 import { db } from "../firebase";
 import { useEffect, useState } from "react";
 export default function Dashboard() {
  const [stats, setStats] = useState({ stock: 0, pendingDeals: 0, revenue: 0, notifications: 0 });
  const [activity, setActivity] = useState([]);
  useEffect(() => {
    async function load() {
      // Crops in stock: harvests with status == 'Available'
      const qStock = query(collection(db, "harvests"), where("status", "==", "Available"));
      const stockSnap = await getCountFromServer(qStock);
      // Pending deals count
      const qDeals = query(collection(db, "deals"), where("status", "==", "Pending"));
      const dealsSnap = await getCountFromServer(qDeals);
      // Notifications count
      const qNoti = query(collection(db, "notifications"));
      const notiSnap = await getCountFromServer(qNoti);
      // Recent activity (last 5 harvests or deals)
      const recent = [];
      const qRecentHarvests = query(collection(db, "harvests"), orderBy("createdAt", "desc"), limit(3));
      const qRecentDeals = query(collection(db, "deals"), orderBy("createdAt", "desc"), limit(2));
      const [hSnap, dSnap] = await Promise.all([getDocs(qRecentHarvests), getDocs(qRecentDeals)]);
      hSnap.forEach(doc => recent.push({ title: `New harvest: ${doc.data().crop}`, subtitle: `${doc.data().quantity} kg`, time: "Just now" }));
      dSnap.forEach(doc => recent.push({ title: `Deal update: ${doc.data().batchId}`, subtitle: doc.data().status, time: "Recently" }));
      setStats({
        stock: stockSnap.data().count,
        pendingDeals: dealsSnap.data().count,
        revenue: 0, // Replace with aggregation if needed
        notifications: notiSnap.data().count
      });
      setActivity(recent);
    }
    load();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Topbar />
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard icon={Leaf} label="Crops in Stock" value={stats.stock} />
              <StatsCard icon={Handshake} label="Pending Deals" value={stats.pendingDeals} />
              <StatsCard icon={DollarSign} label="Revenue (This Month)" value={`Rs ${stats.revenue.toLocaleString()}`} />
              <StatsCard icon={Bell} label="Notifications" value={stats.notifications} />
            </div>
            <ActivityFeed items={activity} />
          </div>
        </main>
      </div>
    </div>
  );
 }
