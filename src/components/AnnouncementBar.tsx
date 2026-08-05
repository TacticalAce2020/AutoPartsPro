"use client";

import { Truck, ShieldCheck } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-red-600 text-white text-sm py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Truck size={14} />
          Free Shipping on Orders over $150
        </span>
        <span className="hidden sm:inline text-red-300">|</span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} />
          Guaranteed Fitment
        </span>
      </div>
    </div>
  );
}
