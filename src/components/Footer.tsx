"use client";

import { ShieldCheck, RotateCcw, Lock, Truck, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      {/* Trust Badges */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 justify-center">
              <div className="bg-green-600/20 p-3 rounded-xl">
                <ShieldCheck size={24} className="text-green-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Guaranteed Fitment</p>
                <p className="text-slate-400 text-xs">Every part verified for your vehicle</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="bg-blue-600/20 p-3 rounded-xl">
                <RotateCcw size={24} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">30-Day Returns</p>
                <p className="text-slate-400 text-xs">Hassle-free return process</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="bg-purple-600/20 p-3 rounded-xl">
                <Lock size={24} className="text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Secure Checkout</p>
                <p className="text-slate-400 text-xs">256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Shop</h3>
            <ul className="space-y-2">
              {["Exhaust", "Suspension", "Brakes", "Lighting", "Exterior & Aero", "Wheels"].map((c) => (
                <li key={c}>
                  <Link href={`/products?category=${encodeURIComponent(c)}`} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Policies</h3>
            <ul className="space-y-2">
              {["Terms of Service", "Shipping Policy", "Return Policy"].map((p) => (
                <li key={p}>
                  <span className="text-slate-400 hover:text-white text-sm transition-colors cursor-pointer">{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-400 hover:text-white text-sm transition-colors cursor-pointer">Order Tracking</span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white text-sm transition-colors cursor-pointer">Contact Support</span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-white text-sm transition-colors cursor-pointer">FAQ</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail size={14} /> support@autopartspro.com
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone size={14} /> 1-800-AUTO-PRO
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Truck size={14} /> Ships from CA, USA
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-slate-500 text-xs">
            © 2026 AutoPartsPro. All rights reserved. Vehicle data is for reference only.
          </p>
        </div>
      </div>
    </footer>
  );
}
