"use client";

import { useEffect, useState, use } from "react";
import { useVehicle } from "@/context/VehicleContext";
import { useCart } from "@/context/CartContext";
import type { Product, Vehicle } from "@/lib/types";
import {
  ShoppingCart, Star, ShieldCheck, AlertTriangle, Check,
  Minus, Plus, Truck, RotateCcw, Package, ChevronLeft
} from "lucide-react";
import Link from "next/link";

const CATEGORY_EMOJIS: Record<string, string> = {
  "Exhaust": "🔧",
  "Suspension": "🏎️",
  "Brakes": "🛑",
  "Lighting": "💡",
  "Exterior & Aero": "🏁",
  "Wheels": "⚙️",
};

function checkFitment(
  fitment: Vehicle[],
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

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const { vehicle, isVehicleSelected, vehicleLabel } = useVehicle();
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-800 rounded w-48" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-slate-800 rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-slate-800 rounded w-3/4" />
              <div className="h-4 bg-slate-800 rounded w-1/2" />
              <div className="h-12 bg-slate-800 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 text-lg">Product not found</p>
        <Link href="/products" className="text-red-400 hover:text-red-300 mt-4 inline-block">
          ← Back to products
        </Link>
      </div>
    );
  }

  const fitStatus = checkFitment(product.fitment, product.isUniversal, vehicle);
  const discount = Math.round((1 - parseFloat(product.price) / parseFloat(product.msrp)) * 100);

  const tabs = [
    { label: "Specs & Features", id: 0 },
    { label: "Vehicle Fitment", id: 1 },
    { label: "Shipping & Returns", id: 2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link href="/products" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
        <ChevronLeft size={14} />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-slate-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
            <span className="text-[120px]">{CATEGORY_EMOJIS[product.category] || "🔧"}</span>
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                SAVE {discount}%
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {[0,1,2,3].map((i) => (
              <div
                key={i}
                className={`aspect-square bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer border-2 transition-colors ${
                  i === 0 ? "border-red-500" : "border-transparent hover:border-slate-600"
                }`}
              >
                <span className="text-3xl">{CATEGORY_EMOJIS[product.category] || "🔧"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="text-red-400 text-sm font-semibold uppercase tracking-wider">{product.brand}</span>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mt-1">{product.title}</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.round(parseFloat(product.rating)) ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}
                  />
                ))}
              </div>
              <span className="text-slate-400 text-sm">{product.rating} ({product.reviewCount} reviews)</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 text-sm font-mono">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Fitment Checker */}
          <div className={`rounded-xl p-4 border ${
            fitStatus === "fits"
              ? "bg-green-600/10 border-green-600/30"
              : fitStatus === "no-fit"
              ? "bg-red-600/10 border-red-600/30"
              : fitStatus === "universal"
              ? "bg-blue-600/10 border-blue-600/30"
              : "bg-slate-800/50 border-slate-700/50"
          }`}>
            {fitStatus === "fits" && (
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-green-400" />
                <div>
                  <p className="text-green-400 font-semibold text-sm">✓ Guaranteed to Fit</p>
                  <p className="text-green-400/70 text-xs">Verified for your {vehicleLabel}</p>
                </div>
              </div>
            )}
            {fitStatus === "no-fit" && (
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-400" />
                <div>
                  <p className="text-red-400 font-semibold text-sm">✗ Does NOT Fit</p>
                  <p className="text-red-400/70 text-xs">This part is not compatible with your {vehicleLabel}</p>
                </div>
              </div>
            )}
            {fitStatus === "universal" && (
              <div className="flex items-center gap-2">
                <Check size={20} className="text-blue-400" />
                <div>
                  <p className="text-blue-400 font-semibold text-sm">Universal Fit</p>
                  <p className="text-blue-400/70 text-xs">Compatible with most vehicles</p>
                </div>
              </div>
            )}
            {fitStatus === "unknown" && (
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-slate-400" />
                <div>
                  <p className="text-slate-300 font-semibold text-sm">Vehicle Compatibility Check</p>
                  <p className="text-slate-400 text-xs">Select your vehicle above to verify fitment</p>
                </div>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-black text-white">${product.price}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-slate-500 line-through">${product.msrp}</span>
                <span className="text-sm font-bold text-red-400">Save ${(parseFloat(product.msrp) - parseFloat(product.price)).toFixed(2)}</span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stockCount > 0 ? (
              <>
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">In Stock — Ships Next Business Day</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                <span className="text-red-400 text-sm font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-slate-700 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-slate-400 hover:text-white transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center text-white font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 text-slate-400 hover:text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={() => addItem(product, quantity)}
              disabled={product.stockCount === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 text-white py-3.5 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-red-600/25"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: "Free Shipping", sub: "Over $150" },
              { icon: RotateCcw, label: "30-Day Returns", sub: "Hassle Free" },
              { icon: Package, label: "Fast Delivery", sub: "1-5 Days" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="text-center bg-slate-800/50 rounded-lg py-3 px-2">
                <Icon size={18} className="text-slate-400 mx-auto mb-1" />
                <p className="text-white text-xs font-medium">{label}</p>
                <p className="text-slate-500 text-[10px]">{sub}</p>
              </div>
            ))}
          </div>

          <p className="text-slate-400 text-sm leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b border-slate-800 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-red-500 text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Features */}
              <div>
                <h3 className="text-white font-semibold mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check size={16} className="text-green-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Specs */}
              <div>
                <h3 className="text-white font-semibold mb-4">Specifications</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key} className="border-b border-slate-800">
                        <td className="py-2.5 text-slate-400 font-medium pr-4">{key}</td>
                        <td className="py-2.5 text-white">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <h3 className="text-white font-semibold mb-4">
                {product.isUniversal ? "Universal Fitment" : "Vehicle Compatibility"}
              </h3>
              {product.isUniversal ? (
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-6 text-center">
                  <p className="text-blue-400 font-semibold">This is a universal fit product</p>
                  <p className="text-blue-400/70 text-sm mt-1">Compatible with most vehicles — verify clearance before installation</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-800">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Year</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Make</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Model</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Submodel</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.fitment.map((f, i) => {
                        const isMatch =
                          isVehicleSelected &&
                          f.year === vehicle.year &&
                          f.make === vehicle.make &&
                          f.model === vehicle.model &&
                          (!vehicle.submodel || f.submodel === vehicle.submodel);
                        return (
                          <tr
                            key={i}
                            className={`border-b border-slate-800 ${isMatch ? "bg-green-600/10" : ""}`}
                          >
                            <td className="py-2.5 px-4 text-white">{f.year}</td>
                            <td className="py-2.5 px-4 text-white">{f.make}</td>
                            <td className="py-2.5 px-4 text-white">{f.model}</td>
                            <td className="py-2.5 px-4 text-white">{f.submodel}</td>
                            <td className="py-2.5 px-4">
                              {isMatch ? (
                                <span className="text-green-400 text-xs font-medium flex items-center gap-1">
                                  <ShieldCheck size={12} /> Your Vehicle
                                </span>
                              ) : (
                                <span className="text-slate-500 text-xs">Compatible</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 2 && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Truck size={18} className="text-red-400" /> Shipping Policy
                </h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <p>• <strong className="text-white">Free Standard Shipping</strong> on orders over $150</p>
                  <p>• <strong className="text-white">Standard Shipping (5-7 days):</strong> $9.99</p>
                  <p>• <strong className="text-white">Express Shipping (2-3 days):</strong> $24.99</p>
                  <p>• <strong className="text-white">Freight (oversized items):</strong> Calculated at checkout</p>
                  <p>• Orders placed before 2PM PST ship same business day</p>
                  <p>• Tracking number provided via email</p>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <RotateCcw size={18} className="text-red-400" /> Return Policy
                </h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <p>• <strong className="text-white">30-Day</strong> hassle-free returns</p>
                  <p>• Items must be unused and in original packaging</p>
                  <p>• Return shipping label provided</p>
                  <p>• Refund processed within 3-5 business days</p>
                  <p>• Custom/special order items are final sale</p>
                  <p>• Contact support@autopartspro.com for returns</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
