import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import HarvestCard from "../components/HarvestCard";
export default function HarvestList() {
 const [harvests, setHarvests] = useState([]);
 const navigate = useNavigate();
 const loadHarvests = async () => {
 const querySnapshot = await getDocs(collection(db, "harvests"));
 setHarvests(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
 };
 const handleDelete = async (id) => {
 await deleteDoc(doc(db, "harvests", id));
 loadHarvests();
 };
 useEffect(() => {
 loadHarvests();
 }, []);
 return (
 <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
 <h1 className="text-2xl font-semibold mb-4 text-green-700">Harvest List</h1>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {harvests.map((h) => (
 <HarvestCard key={h.id} harvest={h} onDelete={handleDelete} onView={() => navigate(`/harvest/${h.id}`)} />
 ))}
 </div>
 </div>
 );
}
