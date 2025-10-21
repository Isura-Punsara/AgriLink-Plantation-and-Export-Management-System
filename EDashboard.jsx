import { useEffect, useState } from "react"; 
import Sidebar from "../components/Sidebar"; 
import Topbar from "../components/Topbar"; 
import StatsCard from "../components/StatsCard"; 
import PlantationCard from "../components/PlantationCard"; 
import { db } from "../firebase"; 
import { collection, getDocs } from "firebase/firestore"; 
import { Leaf, Package, TrendingUp } from "lucide-react"; 
 
export default function Dashboard() { 
  const [plantations, setPlantations] = useState([]); 
 
  useEffect(() => { 
    const fetchPlantations = async () => { 
      const querySnapshot = await getDocs(collection(db, "plantations")); 
      const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); 
      setPlantations(list); 
    }; 
    fetchPlantations(); 
  }, []); 
 
  const handleRequestDeal = (plantation) => { 
    alert(`Deal request sent to ${plantation.name}`); 
  }; 
 
  return ( 
    <div className="flex bg-blue-50 min-h-screen"> 
      <Sidebar /> 
      <main className="flex-1 p-6"> 
        <Topbar exporterName="Global Exports Ltd." /> 
 
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"> 
          <StatsCard icon={<Leaf />} title="Available Plantations" value={plantations.length} /> 
          <StatsCard icon={<Package />} title="Pending Deals" value="4" /> 
          <StatsCard icon={<TrendingUp />} title="Total Shipments" value="12" /> 
        </div> 
 
        <h2 className="text-xl font-semibold text-blue-700 mb-3">Browse Plantations</h2> 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> 
          {plantations.map((p) => ( 
            <PlantationCard key={p.id} plantation={p} onRequestDeal={handleRequestDeal} /> 
          ))} 
        </div> 
      </main> 
    </div> 
  ); 
} 
