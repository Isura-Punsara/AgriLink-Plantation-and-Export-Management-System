import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [contact, setContact] = useState("");
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "exporters", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        setContact(data.contact || "");
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    await updateDoc(doc(db, "exporters", auth.currentUser.uid), { contact });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000); // auto-hide notice after 2s
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="flex bg-blue-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar exporterName={userData?.companyName || "Exporter"} />

        <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Exporter Profile
          </h2>

          {userData ? (
            <>
              <div className="mb-3">
                <p className="text-gray-600 text-sm">Company Name</p>
                <p className="font-medium">{userData.companyName}</p>
              </div>

              <div className="mb-3">
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>

              <div className="mb-3">
                <p className="text-gray-600 text-sm mb-1">Contact</p>
                <input
                  type="text"
                  className="border rounded-md p-2 w-full"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              {saved && (
                <p className="text-green-600 text-sm mb-2">
                  ✅ Profile updated successfully
                </p>
              )}

              <div className="flex justify-between mt-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={handleLogout}
                  className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </main>
    </div>
  );
}
