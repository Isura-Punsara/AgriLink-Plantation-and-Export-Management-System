import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { QRCodeCanvas } from "qrcode.react";

export default function HarvestDetails() {
  const { id } = useParams();
  const [harvest, setHarvest] = useState(null);
  const navigate = useNavigate();
  const qrRef = useRef(null);

  useEffect(() => {
    async function load() {
      const ref = doc(db, "harvests", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setHarvest({ id: snap.id, ...snap.data() });
      }
    }
    load();
  }, [id]);

  const handleUpdateStatus = async (status) => {
    const ref = doc(db, "harvests", id);
    await updateDoc(ref, { status });
    navigate("/harvests/list");
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `batch-${harvest.id}-qr.png`;
    link.click();
  };

  if (!harvest)
    return (
      <Layout>
        <p className="p-6">Loading...</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-xl">
          <h2 className="text-2xl font-semibold mb-3 text-green-700">
            {harvest.crop}
          </h2>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <p>
              <span className="text-gray-500">Quantity:</span> {harvest.quantity} kg
            </p>
            <p>
              <span className="text-gray-500">Grade:</span> {harvest.grade}
            </p>
            <p>
              <span className="text-gray-500">Price per kg:</span>{" "}
              {harvest.price ? `${harvest.price} LKR` : "N/A"}
            </p>
            <p>
              <span className="text-gray-500">Status:</span> {harvest.status}
            </p>
            {harvest.harvestDate && (
              <p>
                <span className="text-gray-500">Harvest Date:</span>{" "}
                {harvest.harvestDate}
              </p>
            )}
            {harvest.fieldLocation && (
              <p>
                <span className="text-gray-500">Field:</span>{" "}
                {harvest.fieldLocation}
              </p>
            )}
            {harvest.notes && (
              <p className="col-span-2">
                <span className="text-gray-500">Notes:</span> {harvest.notes}
              </p>
            )}
          </div>

          {harvest.imageUrl && (
            <div className="mt-4">
              <p className="text-gray-500 text-sm mb-1">Batch Image:</p>
              <img
                src={harvest.imageUrl}
                alt="Batch"
                className="rounded-xl border w-full object-cover max-h-64"
              />
            </div>
          )}

          <div ref={qrRef} className="flex justify-center mt-5">
            <QRCodeCanvas value={`batch:${harvest.id}`} size={160} />
          </div>

          <div className="flex gap-3 justify-center mt-3">
            <button
              onClick={downloadQR}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md"
            >
              Download QR
            </button>
          </div>

          <div className="mt-5 flex justify-between">
            <button
              onClick={() => handleUpdateStatus("Reserved")}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            >
              Reserve
            </button>
            <button
              onClick={() => handleUpdateStatus("Sold")}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Mark Sold
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
