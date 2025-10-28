import { useState } from "react";
import { db, auth, storage } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function AddHarvest() {
  const [crop, setCrop] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(""); // 💰 new field
  const [grade, setGrade] = useState("A");
  const [harvestDate, setHarvestDate] = useState("");
  const [fieldLocation, setFieldLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [status] = useState("Available");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in.");
      setLoading(false);
      return;
    }

    // find ownerId (if worker → ownerId, if owner → uid)
    let ownerId = user.uid;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const u = userDoc.data();
      ownerId = u.role === "worker" ? u.ownerId : user.uid;
    }

    let imageUrl = "";
    if (image) {
      // upload to Firebase Storage
      const imgRef = ref(storage, `harvestImages/${Date.now()}_${image.name}`);
      await uploadBytes(imgRef, image);
      imageUrl = await getDownloadURL(imgRef);
    }

    await addDoc(collection(db, "harvests"), {
      crop,
      quantity: parseFloat(quantity),
      price: parseFloat(price), // 💰 save price
      grade,
      harvestDate,
      fieldLocation,
      notes,
      imageUrl,
      status,
      ownerId,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
    });

    setLoading(false);
    navigate("/harvests/list");
  };

  return (
    <Layout>
      <div className="flex justify-center items-center w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-lg w-96"
        >
          <h2 className="text-2xl font-semibold text-center mb-4 text-green-700">
            Add New Harvest
          </h2>

          <input
            type="text"
            placeholder="Crop Type (Tea / Rubber)"
            className="border rounded-md p-2 w-full mb-3 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setCrop(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Quantity (kg)"
            className="border rounded-md p-2 w-full mb-3 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          {/* 💰 Price Field */}
          <input
            type="number"
            placeholder="Price per kg (LKR)"
            className="border rounded-md p-2 w-full mb-3 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <select
            className="border rounded-md p-2 w-full mb-3 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
          </select>

          <input
            type="date"
            className="border rounded-md p-2 w-full mb-3 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            value={harvestDate}
            onChange={(e) => setHarvestDate(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Field / Location"
            className="border rounded-md p-2 w-full mb-3 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setFieldLocation(e.target.value)}
          />

          <textarea
            placeholder="Additional Notes (optional)"
            className="border rounded-md p-2 w-full mb-3 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="2"
            onChange={(e) => setNotes(e.target.value)}
          />

          <label className="text-sm text-black font-medium mb-1 block">
            Upload Batch Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full mb-3 text-black"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-all duration-300"
          >
            {loading ? "Saving..." : "Save & Generate QR"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
