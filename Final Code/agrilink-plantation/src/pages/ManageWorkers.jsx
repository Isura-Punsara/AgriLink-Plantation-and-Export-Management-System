import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { auth, db, getSecondaryAuth } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  deleteUser,
} from "firebase/auth";

export default function ManageWorkers() {
  const [mine, setMine] = useState({ uid: null });
  const [workers, setWorkers] = useState([]);

  const [wName, setWName] = useState("");
  const [wEmail, setWEmail] = useState("");
  const [wPassword, setWPassword] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // 🔹 Load workers for this owner
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (u) {
        const ownerId = u.uid;
        setMine({ uid: ownerId });
        await loadWorkers(ownerId);
      }
    });
    return () => unsub && unsub();
  }, []);

  const loadWorkers = async (ownerId) => {
    const q = query(
      collection(db, "users"),
      where("ownerId", "==", ownerId),
      where("role", "==", "worker")
    );
    const snap = await getDocs(q);
    setWorkers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  // 🔹 Create new worker
  const createWorker = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");

    try {
      const secondaryAuth = getSecondaryAuth();

      // Check for existing email
      const existing = await fetchSignInMethodsForEmail(secondaryAuth, wEmail);
      if (existing.length > 0) {
        setErr("That email is already registered. Use a different email.");
        return;
      }

      // Create worker auth account
      const cred = await createUserWithEmailAndPassword(
        secondaryAuth,
        wEmail,
        wPassword
      );
      const workerUser = cred.user;

      // Store in Firestore
      await setDoc(doc(db, "users", workerUser.uid), {
        username: wName,
        email: wEmail,
        role: "worker",
        ownerId: mine.uid,
        createdAt: new Date(),
      });

      setOk("Worker created successfully!");
      setWName("");
      setWEmail("");
      setWPassword("");

      await loadWorkers(mine.uid);
    } catch (e2) {
      console.error(e2);
      setErr("Failed to create worker. " + (e2?.message || ""));
    }
  };

  // 🔹 Reset worker password
  const sendReset = async (email) => {
    try {
      await sendPasswordResetEmail(getSecondaryAuth(), email);
      setOk(`Password reset email sent to ${email}`);
      setErr("");
    } catch (e) {
      console.error(e);
      setErr("Failed to send reset email.");
    }
  };

  // 🔹 Delete worker
  const deleteWorker = async (workerId, workerEmail) => {
    try {
      // 1️⃣ Delete Firestore user doc
      await deleteDoc(doc(db, "users", workerId));

      // 2️⃣ Try deleting from Auth (non-critical)
      try {
        const secondaryAuth = getSecondaryAuth();
        const workerUser = await fetchSignInMethodsForEmail(
          secondaryAuth,
          workerEmail
        );
        if (workerUser) {
          await deleteUser(workerUser);
        }
      } catch (authErr) {
        console.warn("Auth deletion skipped:", authErr.message);
      }

      setWorkers((prev) => prev.filter((w) => w.id !== workerId));
      setOk("Worker deleted successfully!");
    } catch (e) {
      console.error("Error deleting worker:", e);
      setErr("Failed to delete worker. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ➕ Add Worker */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-green-700 mb-4">
            Add Worker
          </h2>

          {err && <p className="text-red-500 text-sm mb-2">{err}</p>}
          {ok && <p className="text-green-600 text-sm mb-2">{ok}</p>}

          <form onSubmit={createWorker}>
            <input
              type="text"
              placeholder="Worker Name"
              className="border rounded-md p-2 w-full mb-3"
              value={wName}
              onChange={(e) => setWName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Worker Email"
              className="border rounded-md p-2 w-full mb-3"
              value={wEmail}
              onChange={(e) => setWEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Temporary Password"
              className="border rounded-md p-2 w-full mb-3"
              value={wPassword}
              onChange={(e) => setWPassword(e.target.value)}
              required
            />
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-all">
              Create Worker
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Workers can reset their password later via “Forgot Password”.
          </p>
        </div>

        {/* 👷 Worker List */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-green-700 mb-4">
            Your Workers
          </h2>

          {workers.length === 0 && (
            <p className="text-sm text-gray-500">No workers yet.</p>
          )}

          <div className="space-y-3">
            {workers.map((w) => (
              <div
                key={w.id}
                className="border rounded-xl p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{w.username || "(no name)"}</p>
                  <p className="text-sm text-gray-500">{w.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => sendReset(w.email)}
                    className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-md"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => deleteWorker(w.id, w.email)}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
