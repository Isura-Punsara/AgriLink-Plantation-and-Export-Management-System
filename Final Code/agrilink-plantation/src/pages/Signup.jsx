// src/pages/Signup.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [plantationName, setPlantationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const u = cred.user;

      await setDoc(doc(db, "users", u.uid), {
        username,
        plantationName,
        email: u.email,
        role: "owner",
        ownerId: u.uid,      // owner owns themself
        createdAt: new Date(),
      });

      // You asked to go directly to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in instead.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters long.");
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded-2xl shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-center mb-4 text-green-700">Create Owner Account</h2>
        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Full Name / Username"
          className="border rounded-md p-2 w-full mb-3"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Plantation Name"
          className="border rounded-md p-2 w-full mb-3"
          onChange={(e) => setPlantationName(e.target.value)}
          required
        />
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

        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-all duration-300">
          Register
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-medium">Login</Link>
        </p>
      </form>
    </div>
  );
}
