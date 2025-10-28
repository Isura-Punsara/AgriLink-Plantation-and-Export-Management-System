import { useState } from "react";
import { motion } from "framer-motion";

export default function ShipmentCard({ shipment }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="bg-white border border-blue-100 rounded-2xl shadow-sm p-4 transition hover:shadow-md"
      >
        <h3 className="text-lg font-semibold text-blue-700 mb-1">
          {shipment.crop || "Shipment"}
        </h3>
        <p className="text-sm text-gray-600">Quantity: {shipment.quantity} kg</p>

        <button
          onClick={() => setOpen(true)}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all"
        >
          See Details
        </button>
      </motion.div>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-blue-700 mb-3">
              Shipment Details
            </h2>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <b>Crop:</b> {shipment.crop}
              </p>
              <p>
                <b>Quantity:</b> {shipment.quantity} kg
              </p>
              {shipment.grade && (
                <p>
                  <b>Grade:</b> {shipment.grade}
                </p>
              )}
              {shipment.price && (
                <p>
                  <b>Price:</b> Rs {shipment.price}
                </p>
              )}
              <p>
                <b>Status:</b> {shipment.status || "In Transit"}
              </p>
              {shipment.destination && (
                <p>
                  <b>Destination:</b> {shipment.destination}
                </p>
              )}
              <p>
                <b>Deal ID:</b> {shipment.dealId}
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
