import { motion } from "framer-motion"; 
 
export default function PlantationCard({ plantation, onRequestDeal }) { 
  return ( 
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      className="bg-white rounded-2xl shadow-md border border-blue-100 p-4" 
    > 
      <h3 className="text-lg font-semibold text-blue-700">{plantation.name}</h3> 
      <p className="text-sm text-gray-600">{plantation.location}</p> 
      <p className="text-sm mt-1 text-gray-500">Crops: {plantation.crops}</p> 
      <button 
        onClick={() => onRequestDeal(plantation)} 
        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-md 
transition-all" 
      > 
        Request Deal 
      </button> 
    </motion.div> 
  ); 
} 
