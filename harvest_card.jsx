import { motion } from "framer-motion";
import { Trash2, Eye } from "lucide-react";
export default function HarvestCard({ harvest, onDelete, onView }) {
 return (
 <motion.div whileHover={{ scale: 1.03 }}
 className="bg-white shadow-md rounded-2xl p-4 transition-all border border-gray-100">
 <h3 className="text-lg font-semibold text-green-700 mb-2">{harvest.crop}</h3>
 <p className="text-sm text-gray-600">Quantity: {harvest.quantity} kg</p>
 <p className="text-sm text-gray-600">Grade: {harvest.grade}</p>
 <p className="text-xs text-gray-400 mt-1">Status: {harvest.status}</p>
 <div className="flex justify-between mt-4">
 <button onClick={onView} className="text-green-600 hover:text-green-800 flex items-center gap-1">
 <Eye size={16}/> View
 </button>
 <button onClick={() => onDelete(harvest.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1">
 <Trash2 size={16}/> Delete
 </button>
 </div>
 </motion.div>
 );
}
