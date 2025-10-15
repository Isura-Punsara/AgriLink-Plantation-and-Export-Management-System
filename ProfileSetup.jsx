import { useState } from "react";
import { db, storage, auth } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ProfileSetup() {
  const [plantationName, setPlantationName] = useState("");
  const [location, setLocation] = useState("");
  const [cropTypes, setCropTypes] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    let imageUrl = "";
    if (image) {
      const imgRef = ref(storage, `profiles/${user.uid}`);
      await uploadBytes(imgRef, image);
      imageUrl = await getDownloadURL(imgRef);
    }
    await updateDoc(doc(db, "users", user.uid), {
      plantationName,
      location,
      cropTypes,
      imageUrl,
    });
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4 text-green-700">Setup Profile</h2>
        <input
          type="text"
          placeholder="Plantation Name"
          className="border rounded-md p-2 w-full mb-3"
          onChange={(e) => setPlantationName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="border rounded-md p-2 w-full mb-3"
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Crop Types (Tea, Rubber...)"
          className="border rounded-md p-2 w-full mb-3"
          onChange={(e) => setCropTypes(e.target.value)}
        />
        <input
          type="file"
          className="w-full mb-3"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-200">
          Save & Continue
        </button>
      </form>
    </div>
  );
}
