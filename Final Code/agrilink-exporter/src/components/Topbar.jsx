import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

export default function Topbar() {
  const [exporterName, setExporterName] = useState("");
  const [hasUnread, setHasUnread] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Load exporter name from Firestore once on login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const ref = doc(db, "exporters", user.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            setExporterName(data.companyName || data.email || "Exporter");
          }
        } catch (error) {
          console.error("Failed to load exporter info:", error);
        }
      } else {
        setExporterName("");
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ Live unread-notification listener (auto-refresh on route change)
  useEffect(() => {
    let unsub = null;
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return;
      const q = query(
        collection(db, "notifications"),
        where("recipientId", "==", user.uid),
        where("read", "==", false)
      );
      unsub = onSnapshot(q, (snap) => {
        setHasUnread(snap.docs.length > 0);
      });
    });

    return () => {
      unsubscribe && unsubscribe();
      unsub && unsub();
    };
  }, [location.pathname]);

  // ✅ Hide red dot when inside Notifications page
  useEffect(() => {
    if (location.pathname === "/notifications") {
      setHasUnread(false);
    }
  }, [location.pathname]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex justify-between items-center bg-white shadow-sm px-6 py-3 rounded-2xl mb-4"
    >
      <h2 className="text-xl font-semibold text-blue-700">
        Welcome,&nbsp;{exporterName || "Loading..."}
      </h2>

      <button
        className="relative"
        onClick={() => navigate("/notifications")}
      >
        <Bell className="text-blue-700" size={22} />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full"></span>
        )}
      </button>
    </motion.header>
  );
}
