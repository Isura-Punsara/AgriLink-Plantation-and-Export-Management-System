// src/pages/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const [role, setRole] = useState("owner"); // owner | worker
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const u = cred.user;
      const snap = await getDoc(doc(db, "users", u.uid));

      if (!snap.exists()) {
        await signOut(auth);
        setError("Profile not found. Please contact the owner.");
        return;
      }

      const profile = snap.data();
      if (profile.role !== role) {
        await signOut(auth);
        setError("Selected role does not match this account.");
        return;
      }

      // Go straight to dashboard as you requested
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-center mb-4 text-green-700">Login</h2>

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

        <label className="text-sm mb-1 block">Role</label>
        <select
          className="border rounded-md p-2 w-full mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="owner">Owner</option>
          <option value="worker">Employee</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          className="border rounded-md p-2 w-full mb-3"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded-md p-2 w-full mb-3"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-all duration-300">
          Login
        </button>

        <p className="text-sm mt-3 text-center">
          Don’t have an account?{" "}
          {role === "worker" ? (
            <span className="text-gray-400">Signup disabled for employees</span>
          ) : (
            <Link to="/signup" className="text-green-600 font-medium">Sign up</Link>
          )}
        </p>
      </form>
    </div>
  );
}
