"use client";

import { useCart } from "@/context/CartContext";
import { useVehicle } from "@/context/VehicleContext";
import { X, Minus, Plus, ShoppingBag, Trash2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

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

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, isDrawerOpen, closeDrawer } = useCart();
  const { vehicle, isVehicleSelected, vehicleLabel } = useVehicle();

  const shipping = subtotal >= 150 ? 0 : 9.99;
  const tax = subtotal * 0.0825;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 z-50 transform transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col border-l border-slate-800`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-red-500" />
            <h2 className="text-lg font-bold text-white">Your Cart</h2>
            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <ShoppingBag size={48} className="text-slate-700 mb-4" />
              <p className="text-slate-400 text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-slate-500 text-sm mb-6">Add some parts to get started</p>
              <button
                onClick={closeDrawer}
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Browse Parts
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {items.map((item) => {
                const fitStatus = checkFitment(item.product.fitment, item.product.isUniversal, vehicle);
                return (
                  <div key={item.product.id} className="px-6 py-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-3xl">🔧</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.product.title}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{item.product.brand} • {item.product.sku}</p>

                        {isVehicleSelected && (
                          <div className="mt-1.5">
                            {fitStatus === "fits" && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-400 bg-green-600/15 px-2 py-0.5 rounded-full">
                                <ShieldCheck size={10} /> Fits your {vehicleLabel}
                              </span>
                            )}
                            {fitStatus === "no-fit" && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-400 bg-red-600/15 px-2 py-0.5 rounded-full">
                                ⚠ Does not fit {vehicleLabel}
                              </span>
                            )}
                            {fitStatus === "universal" && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-400 bg-blue-600/15 px-2 py-0.5 rounded-full">
                                Universal Fit
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm text-white font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-white font-bold text-sm">
                              ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-slate-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-800 px-6 py-4 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Estimated Shipping</span>
                <span className={shipping === 0 ? "text-green-400 font-medium" : "text-white font-medium"}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Estimated Tax</span>
                <span className="text-white font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-800">
                <span className="text-white">Total</span>
                <span className="text-white">${total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="block w-full bg-red-600 hover:bg-red-500 text-white text-center py-3 rounded-lg font-bold transition-colors"
            >
              Proceed to Checkout
            </Link>
            {subtotal < 150 && (
              <p className="text-center text-xs text-slate-400">
                Add ${(150 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
