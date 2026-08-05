"use client";

import { useVehicle } from "@/context/VehicleContext";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";
import { ShoppingCart, Star, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";

function checkFitment(
  fitment: { year: number; make: string; model: string; submodel: string }[],
  isUniversal: boolean,
  vehicle: { year: number | null; make: string | null; model: string | null; submodel: string | null }
) {
  if (isUniversal) return "universal";
  if (!vehicle.year || !vehicle.make || !vehicle.model) return "unknown";
  return fitment.some(
    (f) =>
      f.year === vehicle.year &&
      f.make === vehicle.make &&
      f.model === vehicle.model &&
      (!vehicle.submodel || f.submodel === vehicle.submodel)
  )
    ? "fits"
    : "no-fit";
}

const CATEGORY_EMOJIS: Record<string, string> = {
  "Exhaust": "🔧",
  "Suspension": "🏎️",
  "Brakes": "🛑",
  "Lighting": "💡",
  "Exterior & Aero": "🏁",
  "Wheels": "⚙️",
};

export default function ProductCard({ product }: { product: Product }) {
  const { vehicle, isVehicleSelected, vehicleLabel } = useVehicle();
  const { addItem } = useCart();
  const fitStatus = checkFitment(product.fitment, product.isUniversal, vehicle);
  const discount = Math.round((1 - parseFloat(product.price) / parseFloat(product.msrp)) * 100);

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600 transition-all group">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/3] bg-slate-800 flex items-center justify-center overflow-hidden">
          <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
            {CATEGORY_EMOJIS[product.category] || "🔧"}
          </span>
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
              -{discount}%
            </span>
          )}
          {isVehicleSelected && (
            <div className="absolute top-3 right-3">
              {fitStatus === "fits" && (
                <span className="flex items-center gap-1 bg-green-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                  <ShieldCheck size={10} /> FITS
                </span>
              )}
              {fitStatus === "no-fit" && (
                <span className="flex items-center gap-1 bg-red-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                  <AlertTriangle size={10} /> NO FIT
                </span>
              )}
              {fitStatus === "universal" && (
                <span className="flex items-center gap-1 bg-blue-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                  UNIVERSAL
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-red-400 uppercase tracking-wider">{product.brand}</span>
          <span className="text-[10px] text-slate-500 font-mono">{product.sku}</span>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-white text-sm font-semibold line-clamp-2 hover:text-red-400 transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>

        {isVehicleSelected && (
          <div>
            {fitStatus === "fits" && (
              <p className="text-[11px] text-green-400 flex items-center gap-1">
                <ShieldCheck size={11} /> Fits your {vehicleLabel}
              </p>
            )}
            {fitStatus === "no-fit" && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertTriangle size={11} /> Does NOT fit {vehicleLabel}
              </p>
            )}
            {fitStatus === "universal" && (
              <p className="text-[11px] text-blue-400">Universal fit — works with any vehicle</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.round(parseFloat(product.rating)) ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}
            />
          ))}
          <span className="text-[11px] text-slate-400 ml-1">({product.reviewCount})</span>
        </div>

        <div className="flex items-end justify-between pt-1">
          <div>
            <span className="text-lg font-bold text-white">${product.price}</span>
            {discount > 0 && (
              <span className="text-xs text-slate-500 line-through ml-2">${product.msrp}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <ShoppingCart size={13} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
