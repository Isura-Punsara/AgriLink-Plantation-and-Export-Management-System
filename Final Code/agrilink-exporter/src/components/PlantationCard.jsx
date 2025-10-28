import { motion } from "framer-motion";
import { MapPin, Sprout, Factory } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PlantationCard({ plantation }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (plantation.ownerId) {
      navigate("/plantations", { state: { ownerId: plantation.ownerId } });
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={handleClick}
      className="bg-white border border-blue-100 rounded-2xl shadow-md p-5 
                 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
          <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-1">
            <Factory size={16} /> {plantation.name}
          </h3>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
          <p className="text-sm text-gray-700 flex items-center gap-1">
            <MapPin size={14} className="text-blue-500" />
            {plantation.location || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Crops</p>
          <p className="text-sm text-gray-700 flex items-center gap-1">
            <Sprout size={14} className="text-green-600" />
            {plantation.crops || "N/A"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
