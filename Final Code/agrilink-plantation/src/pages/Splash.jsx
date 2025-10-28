// src/pages/Splash.jsx
import { motion } from "framer-motion";
import { Sprout } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Sprout size={64} className="text-green-600 mb-4" />
      </motion.div>
      <h1 className="text-3xl font-semibold text-green-700">AgriLink</h1>
      <p className="text-gray-600 mt-2">Connecting Plantations with Exporters</p>
    </div>
  );
}
