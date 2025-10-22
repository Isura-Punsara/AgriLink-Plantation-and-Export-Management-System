import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DealCard from "../components/DealCard";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
export default function Deals() {
 const [deals, setDeals] = useState([]);
 const [showForm, setShowForm] = useState(false);
 const [selectedDeal, setSelectedDeal] = useState(null);
 const [newPrice, setNewPrice] = useState("");
 useEffect(() => {
 const fetchDeals = async () => {
 const snapshot = await getDocs(collection(db, "deals"));
 const dealList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
 setDeals(dealList);
 };
 fetchDeals();
 }, []);
 const handleConfirm = async (deal) => {
 const dealRef = doc(db, "deals", deal.id);
 await updateDoc(dealRef, { status: "Confirmed" });
 alert(`Deal for ${deal.cropType} confirmed!`);
 };
 const handleCounter = (deal) => {
 setSelectedDeal(deal);
 setShowForm(true);
 };
 const handleSubmitCounter = async (e) => {
 e.preventDefault();
 const dealRef = doc(db, "deals", selectedDeal.id);
 await updateDoc(dealRef, {
 counterPrice: newPrice,
 status: "Counter Offered",
 });
 alert("Counter offer submitted!");
 setShowForm(false);
 };
 return (
 <div className="flex bg-blue-50 min-h-screen">
 <Sidebar />
 <main className="flex-1 p-6">
 <Topbar exporterName="Global Exports Ltd." />
 <h2 className="text-xl font-semibold text-blue-700 mb-4">Deal Requests</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {deals.map((d) => (
 <DealCard
 key={d.id}
 deal={d}
 onConfirm={handleConfirm}
 onCounter={handleCounter}
 />
 ))}
 </div>
 {showForm && (
 <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
 <form
 onSubmit={handleSubmitCounter}
 className="bg-white rounded-2xl shadow-lg p-6 w-96"
 >
 <h3 className="text-xl font-semibold text-blue-700 mb-3">
 Counter Offer — {selectedDeal.cropType}
 </h3>
 <p className="text-sm text-gray-600 mb-2">
 Plantation: {selectedDeal.plantationName}
 </p>
 <input
 type="number"
 placeholder="Enter new price"
 className="border rounded-md p-2 w-full mb-3"
 onChange={(e) => setNewPrice(e.target.value)}
 />
 <div className="flex justify-end gap-2">
 <button
 type="button"
 onClick={() => setShowForm(false)}
 className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bggray-50"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
 >
 Submit
 </button>
 </div>
 </form>
 </div>
 )}
 </main>
 </div>
 );
}
