import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { db, auth } from "../firebase";
import { collection, onSnapshot, query, where, doc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

export default function Topbar({ plantationName }) {
  const [hasUnread, setHasUnread] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) setRole(userDoc.data().role);

      // Skip if worker
      if (userDoc.exists() && userDoc.data().role === "worker") return;

      const q = query(
        collection(db, "notifications"),
        where("recipientId", "==", user.uid),
        where("read", "==", false)
      );

      const unsubNotif = onSnapshot(q, (snapshot) => {
        setHasUnread(snapshot.docs.length > 0);
      });

      return () => unsubNotif();
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (location.pathname === "/notifications") {
      setHasUnread(false);
    }
  }, [location]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex justify-between items-center bg-white shadow-sm px-6 py-3 rounded-2xl mb-4"
    >
      <h2 className="text-xl font-semibold text-green-700">
        {plantationName ? `Welcome back, ${plantationName}` : "Welcome back"}
      </h2>

      {/* Hide bell for workers */}
      {role !== "worker" && (
        <button className="relative" onClick={() => navigate("/notifications")}>
          <Bell className="text-green-700" size={22} />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full"></span>
          )}
        </button>
      )}
    </motion.header>
  );
}
