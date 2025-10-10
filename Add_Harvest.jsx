import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
export default function AddHarvest() {
 const [crop, setCrop] = useState("");
 const [quantity, setQuantity] = useState("");
 const [grade, setGrade] = useState("A");
 const [status, setStatus] = useState("Available");
 const navigate = useNavigate();
 const handleSubmit = async (e) => {
 e.preventDefault();
 await addDoc(collection(db, "harvests"), {
 crop,
 quantity: parseFloat(quantity),
 grade,
 status,
 createdAt: serverTimestamp(),
 });
 navigate("/harvests");
 };
 return (
 <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
 <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg w-96">
 <h2 className="text-2xl font-semibold text-center mb-4 text-green-700">Add New Harvest</h2>
 <input type="text" placeholder="Crop Type (Tea / Rubber)" className="border rounded-md p-2 w-full mb-3"
 onChange={(e) => setCrop(e.target.value)} />
 <input type="number" placeholder="Quantity (kg)" className="border rounded-md p-2 w-full mb-3"
 onChange={(e) => setQuantity(e.target.value)} />
 <select className="border rounded-md p-2 w-full mb-3" onChange={(e) => setGrade(e.target.value)}>
 <option value="A">Grade A</option>
 <option value="B">Grade B</option>
 <option value="C">Grade C</option>
 </select>
 <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-all duration-300">
 Save & Generate QR
 </button>
 </form>
 </div>
 );
}
