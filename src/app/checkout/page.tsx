"use client";

import { useCart } from "@/context/CartContext";
import { Lock, CreditCard, ShieldCheck, Truck, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CATEGORY_EMOJIS: Record<string, string> = {
  "Exhaust": "🔧",
  "Suspension": "🏎️",
  "Brakes": "🛑",
  "Lighting": "💡",
  "Exterior & Aero": "🏁",
  "Wheels": "⚙️",
};

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shippingCost = shippingMethod === "express" ? 24.99 : shippingMethod === "freight" ? 49.99 : subtotal >= 150 ? 0 : 9.99;
  const tax = subtotal * 0.0825;
  const total = subtotal + shippingCost + tax;

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-green-600/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={40} className="text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h1>
        <p className="text-slate-400 mb-2">Thank you for your purchase. Your order #APR-{Math.floor(10000 + Math.random() * 90000)} has been placed.</p>
        <p className="text-slate-500 text-sm mb-8">You&apos;ll receive a confirmation email with tracking details shortly.</p>
        <Link href="/" className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold transition-colors inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 text-lg mb-4">Your cart is empty</p>
        <Link href="/products" className="text-red-400 hover:text-red-300 font-medium">
          ← Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
        <ChevronLeft size={14} />
        Continue Shopping
      </Link>

      <h1 className="text-2xl font-bold text-white mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Truck size={18} className="text-red-400" />
              Shipping Address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">First Name</label>
                <input type="text" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Last Name</label>
                <input type="text" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="Doe" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input type="email" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="john@example.com" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Street Address</label>
                <input type="text" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="123 Main Street" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">City</label>
                <input type="text" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="Los Angeles" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">State</label>
                  <input type="text" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="CA" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">ZIP</label>
                  <input type="text" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="90001" />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Shipping Method</h2>
            <div className="space-y-3">
              {[
                { id: "standard", label: "Standard Shipping", desc: "5-7 business days", price: subtotal >= 150 ? "FREE" : "$9.99" },
                { id: "express", label: "Express Shipping", desc: "2-3 business days", price: "$24.99" },
                { id: "freight", label: "Freight (Heavy Items)", desc: "7-14 business days", price: "$49.99" },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    shippingMethod === method.id
                      ? "border-red-500 bg-red-600/10"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === method.id}
                      onChange={() => setShippingMethod(method.id)}
                      className="accent-red-500"
                    />
                    <div>
                      <p className="text-white text-sm font-medium">{method.label}</p>
                      <p className="text-slate-400 text-xs">{method.desc}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${method.price === "FREE" ? "text-green-400" : "text-white"}`}>
                    {method.price}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-red-400" />
              Payment
            </h2>
            <div className="flex gap-3 mb-4">
              <button className="flex-1 bg-red-600/20 border border-red-600/50 text-red-400 py-2.5 rounded-lg text-sm font-medium">
                Credit Card
              </button>
              <button className="flex-1 bg-slate-700 border border-slate-600 text-slate-400 py-2.5 rounded-lg text-sm font-medium hover:text-white transition-colors">
                PayPal
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Card Number</label>
                <input type="text" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Expiry</label>
                  <input type="text" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">CVC</label>
                  <input type="text" className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="123" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 sticky top-48">
            <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>

            <div className="divide-y divide-slate-700/50 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 py-3">
                  <div className="w-14 h-14 bg-slate-700 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-2xl">{CATEGORY_EMOJIS[item.product.category] || "🔧"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.product.title}</p>
                    <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-white text-sm font-bold shrink-0">
                    ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-slate-700/50 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Shipping</span>
                <span className={shippingCost === 0 ? "text-green-400" : "text-white"}>
                  {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tax</span>
                <span className="text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-700/50">
                <span className="text-white">Total</span>
                <span className="text-white">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setOrderPlaced(true)}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-3.5 rounded-xl font-bold mt-6 flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-red-600/25"
            >
              <Lock size={16} />
              Place Order — ${total.toFixed(2)}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-slate-500 text-xs">
              <Lock size={12} />
              <span>Secured with 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
