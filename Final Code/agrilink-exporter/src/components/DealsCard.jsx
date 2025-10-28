// src/components/DealsCard.jsx
import { motion } from "framer-motion";

export default function DealCard({ deal, onConfirm, onCounter }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm"
    >
      {/* 🌾 Crop Name */}
      <h3 className="text-lg font-semibold text-blue-700">
        {deal.cropType}
      </h3>

      {/* 📦 Quantity */}
      <p className="text-sm text-gray-600">
        Quantity: {deal.quantity} kg
      </p>

      {/* 💰 Offered Price */}
      <p className="text-sm text-gray-600">
        Offered Price: Rs. {deal.price}
      </p>

      {/* ❌ Removed Plantation / Owner line */}

      {/* ✅ Buttons */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onConfirm(deal)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-md transition-all duration-300"
        >
          Confirm
        </button>

        <button
          onClick={() => onCounter(deal)}
          className="flex-1 border border-blue-400 text-blue-600 hover:bg-blue-50 py-1.5 rounded-md transition-all duration-300"
        >
          Counter Offer
        </button>
      </div>
    </motion.div>
  );
}
