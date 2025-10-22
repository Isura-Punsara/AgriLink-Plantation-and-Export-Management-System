import { motion } from "framer-motion"; 
 
export default function StatsCard({ icon, title, value }) { 
  return ( 
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-4 transition-all 
border border-blue-100" 
    > 
      <div className="text-blue-600">{icon}</div> 
      <div> 
        <p className="text-sm text-gray-600">{title}</p> 
        <h3 className="text-2xl font-semibold text-blue-700">{value}</h3> 
      </div> 
    </motion.div> 
  ); 
} 
