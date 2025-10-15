import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role: "Plantation Owner",
      createdAt: new Date()
    });
    navigate("/profile-setup");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
      <form onSubmit={handleSignup} className="bg-white p-6 rounded-2xl shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-center mb-4 text-green-700">Sign Up</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="border rounded-md p-2 w-full mb-3"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border rounded-md p-2 w-full mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded-md p-2 w-full mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-200">
          Register
        </button>
      </form>
    </div>
  );
}
