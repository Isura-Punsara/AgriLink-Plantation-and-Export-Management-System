// src/components/Layout.jsx
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Layout({ children }) {
  // 👇 default role = 'owner' to prevent sidebar flicker
  const [userInfo, setUserInfo] = useState({ role: "owner" });

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (u) {
        try {
          const snap = await getDoc(doc(db, "users", u.uid));
          if (snap.exists()) {
            setUserInfo({ uid: u.uid, email: u.email, ...snap.data() });
          } else {
            setUserInfo({ uid: u.uid, email: u.email });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setUserInfo({ role: "owner" }); // fallback so layout remains stable
      }
    });
    return () => unsub && unsub();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="flex">
        {/* Sidebar stays rendered from the start */}
        <Sidebar role={userInfo?.role || "owner"} />

        <main className="flex-1 p-4">
          <Topbar
            plantationName={userInfo?.plantationName || userInfo?.username}
            notifications={userInfo?.notificationsCount || 0}
          />
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
