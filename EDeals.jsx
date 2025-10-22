import { motion } from "framer-motion";
export default function DealCard({ deal, onConfirm, onCounter }) {
 return (
 <motion.div
 whileHover={{ scale: 1.02 }}
 className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm"
 >
 <h3 className="text-lg font-semibold text-blue-700">{deal.cropType}</h3>
 <p className="text-sm text-gray-600">Quantity: {deal.quantity} kg</p>
 <p className="text-sm text-gray-600">Offered Price: Rs. {deal.price}</p>
 <p className="text-sm text-gray-500 mt-1">Plantation: {deal.plantationName}</p>
 <div className="flex gap-2 mt-3">
 <button
 onClick={() => onConfirm(deal)}
 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-md"
 >
 Confirm
 </button>
 <button
 onClick={() => onCounter(deal)}
 className="flex-1 border border-blue-400 text-blue-600 hover:bg-blue-50 py-1.5 roundedmd"
 >
 Counter Offer
 </button>
 </div>
 </motion.div>
 );
}
