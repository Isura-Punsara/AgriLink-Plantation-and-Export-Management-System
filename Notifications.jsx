import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Bell } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-b from-green-50 to-white min-h-screen">
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
                : ""}
            </p>
          </div>
        ))}

        {notifications.length === 0 && (
          <p className="text-sm text-gray-500">No notifications yet</p>
        )}
      </div>
    </div>
  );
}
