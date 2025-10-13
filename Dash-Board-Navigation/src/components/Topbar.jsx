 import { Bell, Menu } from "lucide-react";
 import { useState } from "react";
 export default function Topbar({ onMenu }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="w-full bg-white/70 backdrop-blur sticky top-0 z-10 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <button className="md:hidden" onClick={() => onMenu?.()}><Menu /></button>
        <h1 className="text-xl font-semibold">Welcome back </h1>
        <button className="relative">
          <Bell />
          <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1.5">3</span>
        </button>
      </div>
    </header>
  );
 }