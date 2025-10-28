// src/pages/ProfileSetup.jsx
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Layout from "../components/Layout";

export default function ProfileSetup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    plantationName: "",
    location: "",
    cropTypes: "",
    contact: "",
  });
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setRole(data.role);
        setForm((prev) => ({
          ...prev,
          username: data.username || "",
          email: data.email || user.email || "",
          plantationName: data.plantationName || "",
          location: data.location || "",
          cropTypes: data.cropTypes || "",
          contact: data.contact || "",
        }));
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const user = auth.currentUser;
      await updateDoc(doc(db, "users", user.uid), {
        plantationName: form.plantationName,
        location: form.location,
        cropTypes: form.cropTypes,
        contact: form.contact,
      });
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      setMessage("❌ Failed to update profile. Please try again.");
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = "/login";
  };

  if (loading)
    return (
      <Layout>
        <p className="p-6 text-gray-600">Loading profile...</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="flex justify-center">
        <form
          onSubmit={handleSave}
          className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold text-center mb-4 text-green-700">
            {role === "worker" ? "Worker Profile" : "Owner Profile"}
          </h2>

          {/* Subtle success/error message */}
          {message && (
            <p
              className={`text-center text-sm mb-3 ${
                message.startsWith("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          {/* Read-only fields for both */}
          <input
            name="username"
            type="text"
            value={form.username}
            readOnly
            className="border rounded-md p-2 w-full mb-3 text-black bg-gray-100"
            placeholder="Username"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            readOnly
            className="border rounded-md p-2 w-full mb-3 text-black bg-gray-100"
            placeholder="Email"
          />

          {/* 🌱 Owner fields */}
          {role === "owner" && (
            <>
              <input
                name="plantationName"
                type="text"
                placeholder="Plantation Name"
                className="border rounded-md p-2 w-full mb-3 text-black"
                value={form.plantationName}
                onChange={handleChange}
              />
              <input
                name="location"
                type="text"
                placeholder="Location"
                className="border rounded-md p-2 w-full mb-3 text-black"
                value={form.location}
                onChange={handleChange}
              />
              <input
                name="cropTypes"
                type="text"
                placeholder="Crop Types (Tea, Rubber...)"
                className="border rounded-md p-2 w-full mb-3 text-black"
                value={form.cropTypes}
                onChange={handleChange}
              />
            </>
          )}

          {/* 👷 Worker fields */}
          {role === "worker" && (
            <input
              name="contact"
              type="text"
              placeholder="Contact Number"
              className="border rounded-md p-2 w-full mb-3 text-black"
              value={form.contact}
              onChange={handleChange}
            />
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-all duration-300"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
