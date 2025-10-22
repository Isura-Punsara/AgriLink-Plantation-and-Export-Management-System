import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "notifications"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(list);
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex bg-blue-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar exporterName="Global Exports Ltd." />
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Notifications</h2>

        <div className="space-y-3">
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-blue-100 p-4"
            >
              <p className="text-gray-700">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{n.timestamp}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
