import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch,
  doc,
  getDocs,
} from "firebase/firestore";
import { motion } from "framer-motion";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  // ✅ Realtime fetch notifications for this exporter
  useEffect(() => {
    let unsub = () => {};
    (async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "notifications"),
        where("recipientId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      unsub = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(list);
      });
    })();
    return () => unsub && unsub();
  }, []);

  // ✅ Mark unread notifications as read ONCE when page opens
  useEffect(() => {
    const markAsRead = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "notifications"),
        where("recipientId", "==", user.uid),
        where("read", "==", false)
      );

      const snap = await getDocs(q);
      if (!snap.empty) {
        const batch = writeBatch(db);
        snap.docs.forEach((docSnap) => {
          batch.update(doc(db, "notifications", docSnap.id), { read: true });
        });
        await batch.commit(); // ✅ commit once only
      }
    };
    markAsRead();
  }, []);

  return (
    <Layout exporterName="Global Exports Ltd.">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Notifications</h2>

      <div className="space-y-3">
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-md border border-blue-100 p-4"
          >
            <p className="text-gray-700">{n.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {n.createdAt?.seconds
                ? new Date(n.createdAt.seconds * 1000).toLocaleString()
                : "Recently"}
            </p>
          </motion.div>
        ))}
        {notifications.length === 0 && (
          <p className="text-sm text-gray-500">No notifications yet.</p>
        )}
      </div>
    </Layout>
  );
}
