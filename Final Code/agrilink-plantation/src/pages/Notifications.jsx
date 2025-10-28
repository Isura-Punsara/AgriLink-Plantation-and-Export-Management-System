import { useEffect, useState } from "react";
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
import { Bell } from "lucide-react";
import Layout from "../components/Layout";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  // ✅ Realtime fetch notifications for this plantation user
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

      unsub = onSnapshot(q, (snap) => {
        setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
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
    <Layout>
      <div className="p-2 min-h-[calc(100vh-180px)]">
        <h1 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
          <Bell className="text-green-600" /> Notifications
        </h1>
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="bg-white p-3 rounded-xl shadow-md border">
              <p className="font-medium text-gray-800">{n.message}</p>
              <p className="text-xs text-gray-400">
                {n.createdAt?.seconds
                  ? new Date(n.createdAt.seconds * 1000).toLocaleString()
                  : "Recently"}
              </p>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-sm text-gray-500">No notifications yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
