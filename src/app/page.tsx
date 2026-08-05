"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useVehicle } from "@/context/VehicleContext";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { ChevronRight, Zap, ShieldCheck, Truck, ArrowRight, Flame, Star } from "lucide-react";

const CATEGORIES = [
  { name: "Exhaust", emoji: "🔧", desc: "Cat-backs, headers, downpipes", color: "from-red-600/20 to-orange-600/20 border-red-600/30" },
  { name: "Suspension", emoji: "🏎️", desc: "Coilovers, shocks, springs", color: "from-blue-600/20 to-cyan-600/20 border-blue-600/30" },
  { name: "Brakes", emoji: "🛑", desc: "Big brake kits, pads, rotors", color: "from-yellow-600/20 to-amber-600/20 border-yellow-600/30" },
  { name: "Lighting", emoji: "💡", desc: "LED headlights, fog lights, bars", color: "from-purple-600/20 to-violet-600/20 border-purple-600/30" },
  { name: "Exterior & Aero", emoji: "🏁", desc: "Body kits, splitters, hoods", color: "from-green-600/20 to-emerald-600/20 border-green-600/30" },
  { name: "Wheels", emoji: "⚙️", desc: "Forged, flow-formed, racing", color: "from-pink-600/20 to-rose-600/20 border-pink-600/30" },
];

export default function HomePage() {
  const { isVehicleSelected, vehicleLabel, vehicle } = useVehicle();
  const [vehicleParts, setVehicleParts] = useState<Product[]>([]);
  const [topParts, setTopParts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/products?sort=rating")
      .then((r) => r.json())
      .then((data) => setTopParts(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isVehicleSelected) {
      setVehicleParts([]);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams({
      fitmentOnly: "true",
      vehicleYear: String(vehicle.year),
      vehicleMake: vehicle.make || "",
      vehicleModel: vehicle.model || "",
    });
    if (vehicle.submodel) params.set("vehicleSubmodel", vehicle.submodel);

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => { setVehicleParts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isVehicleSelected, vehicle.year, vehicle.make, vehicle.model, vehicle.submodel]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-red-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Flame size={18} className="text-red-500" />
              <span className="text-red-400 font-semibold text-sm uppercase tracking-widest">Performance Parts</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              Upgrade Your Ride.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                Guaranteed Fitment.
              </span>
            </h1>
            <p className="text-slate-300 text-lg mb-8 max-w-lg">
              Select your vehicle above to see parts guaranteed to fit. Premium brands, fast shipping, and expert support.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-red-600/25"
              >
                Shop All Parts
                <ArrowRight size={18} />
              </Link>
              {!isVehicleSelected && (
                <div className="inline-flex items-center gap-2 border border-slate-600 text-slate-300 px-6 py-3.5 rounded-xl text-sm">
                  <ShieldCheck size={16} className="text-green-400" />
                  Select Your Vehicle to Guarantee Fitment
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-800/50 border-y border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Zap, label: "Performance Parts", value: "10,000+" },
              { icon: ShieldCheck, label: "Guaranteed Fitment", value: "100%" },
              { icon: Truck, label: "Free Shipping", value: "$150+" },
              { icon: Star, label: "Customer Rating", value: "4.8/5" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon size={20} className="text-red-400 mx-auto mb-1" />
                <p className="text-white font-bold text-lg">{value}</p>
                <p className="text-slate-400 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Shop by Category</h2>
            <p className="text-slate-400 text-sm mt-1">Browse our full catalog of performance parts</p>
          </div>
          <Link href="/products" className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1 transition-colors">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`bg-gradient-to-br ${cat.color} border rounded-xl p-5 text-center hover:scale-105 transition-all duration-200 group`}
            >
              <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <h3 className="text-white font-semibold text-sm">{cat.name}</h3>
              <p className="text-slate-400 text-[11px] mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Vehicle Parts Slider */}
      {isVehicleSelected && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Parts for Your{" "}
                <span className="text-red-400">{vehicleLabel}</span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">Guaranteed to fit your vehicle</p>
            </div>
            <Link href="/products" className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1 transition-colors">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map((i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl animate-pulse h-72" />
              ))}
            </div>
          ) : vehicleParts.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <p className="text-slate-400">No specific fitment parts found for your vehicle. Check out our universal parts!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {vehicleParts.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Top Rated */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Top Rated Parts</h2>
            <p className="text-slate-400 text-sm mt-1">Highest rated by our customers</p>
          </div>
          <Link href="/products" className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1 transition-colors">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        {topParts.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl animate-pulse h-72" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topParts.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
