import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      await setDoc(doc(db, "exporters", user.uid), {
        companyName,
        contact,
        email,
        role: "Exporter",
        createdAt: new Date(),
      });
      navigate("/dashboard");
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-50">
      <form
        onSubmit={handleSignup}
        className="bg-white shadow-lg rounded-2xl p-6 w-80 border border-blue-100"
      >
        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-700">
          Exporter Registration
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Company Name"
          className="border rounded-md p-2 w-full mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Contact Number"
          className="border rounded-md p-2 w-full mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          onChange={(e) => setContact(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border rounded-md p-2 w-full mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded-md p-2 w-full mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all duration-300">
          Register
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
