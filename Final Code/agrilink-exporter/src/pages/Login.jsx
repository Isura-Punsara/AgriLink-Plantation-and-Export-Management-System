import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-6 w-80 border border-blue-100"
      >
        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-700">
          Exporter Login
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

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
          Login
        </button>

        <p className="text-sm mt-3 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
