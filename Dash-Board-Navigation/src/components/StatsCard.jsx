 import { motion } from "framer-motion";
 export default function StatsCard({ icon, label, value, footer }) {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-green-50">{Icon && <Icon className="text-green-700" />}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
      {footer && <p className="text-xs text-gray-400 mt-2">{footer}</p>}
    </motion.div>
  );
 }