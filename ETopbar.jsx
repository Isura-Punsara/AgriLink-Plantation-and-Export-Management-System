import { Bell } from "lucide-react"; 
import { motion } from "framer-motion"; 
 
export default function Topbar({ exporterName }) { 
  return ( 
    <motion.header 
      initial={{ y: -20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.4 }} 
      className="flex justify-between items-center bg-white shadow-sm px-6 py-3 rounded-2xl 
mb-4" 
    > 
      <h2 className="text-xl font-semibold text-blue-700"> 
        Welcome,&nbsp;{exporterName || "Exporter"} 
      </h2> 
      <button className="relative"> 
        <Bell className="text-blue-700" size={22} /> 
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px
1.5"> 
          3 
        </span> 
      </button> 
    </motion.header> 
  ); 
} 
