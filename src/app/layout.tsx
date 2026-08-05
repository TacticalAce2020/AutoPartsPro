import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { VehicleProvider } from "@/context/VehicleContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Seeder from "@/components/Seeder";

export const metadata: Metadata = {
  title: "AutoPartsPro — Performance Auto Parts | Guaranteed Fitment",
  description: "Shop premium performance auto parts with guaranteed fitment. Exhaust, suspension, brakes, lighting, wheels and more. Free shipping over $150.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col">
        <VehicleProvider>
          <CartProvider>
            <Seeder />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </VehicleProvider>
      </body>
    </html>
  );
}
