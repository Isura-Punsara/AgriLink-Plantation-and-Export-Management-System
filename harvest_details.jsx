import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
export default function HarvestDetails() {
 const { id } = useParams();
 const [harvest, setHarvest] = useState(null);
 const navigate = useNavigate();
 useEffect(() => {
 async function load() {
 const ref = doc(db, "harvests", id);
 const snap = await getDoc(ref);
 if (snap.exists()) setHarvest({ id: snap.id, ...snap.data() });
 }
 load();
 }, [id]);
 const handleUpdateStatus = async (status) => {
 const ref = doc(db, "harvests", id);
 await updateDoc(ref, { status });
 navigate("/harvests");
 };
 if (!harvest) return <p className="p-6">Loading...</p>;
 return (
 <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6 flex flex-col items-center">
 <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
 <h2 className="text-2xl font-semibold mb-2 text-green-700">{harvest.crop}</h2>
 <p className="text-gray-600">Quantity: {harvest.quantity} kg</p>
 <p className="text-gray-600">Grade: {harvest.grade}</p>
 <p className="text-gray-600">Status: {harvest.status}</p>
 <div className="flex justify-center mt-4">
 <QRCode value={`batch:${harvest.id}`} size={128} />
 </div>
 <div className="mt-4 flex justify-between">
 <button onClick={() => handleUpdateStatus("Reserved")}
 className="bg-yellow-500 text-white px-3 py-2 rounded-md">Reserve</button>
 <button onClick={() => handleUpdateStatus("Sold")}
 className="bg-green-600 text-white px-3 py-2 rounded-md">Mark Sold</button>
 </div>
 </div>
 </div>
 );
}
