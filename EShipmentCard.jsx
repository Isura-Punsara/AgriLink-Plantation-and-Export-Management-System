import { motion } from "framer-motion";

export default function ShipmentCard({ shipment }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-blue-100 rounded-2xl shadow-md p-4"
    >
      <h3 className="text-lg font-semibold text-blue-700">
        Shipment #{shipment.id}
      </h3>
      <p className="text-sm text-gray-600">Crop: {shipment.crop}</p>
      <p className="text-sm text-gray-600">Quantity: {shipment.quantity} kg</p>
      <p className="text-sm text-gray-600">Status: {shipment.status}</p>
      <p className="text-sm text-gray-500 mt-1">
        Destination: {shipment.destination}
      </p>
    </motion.div>
  );
}
