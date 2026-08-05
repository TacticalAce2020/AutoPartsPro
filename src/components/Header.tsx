"use client";

import Link from "next/link";
import { ShoppingCart, User, Wrench } from "lucide-react";
import { useCart } from "@/context/CartContext";
import AnnouncementBar from "./AnnouncementBar";
import SearchBar from "./SearchBar";
import YMMSelector from "./YMMSelector";

export default function Header() {
  const { itemCount, openDrawer } = useCart();

  return (
    <header className="sticky top-0 z-40">
      <AnnouncementBar />
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="bg-red-600 p-1.5 rounded-lg">
                <Wrench size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight hidden sm:inline">
                Auto<span className="text-red-500">Parts</span>Pro
              </span>
            </Link>

            <SearchBar />

            <div className="flex items-center gap-2 shrink-0">
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <User size={20} />
              </button>
              <button
                onClick={openDrawer}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <YMMSelector />
    </header>
  );
}
