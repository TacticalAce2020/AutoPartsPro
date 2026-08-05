"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVehicle } from "@/context/VehicleContext";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

const CATEGORIES = ["Exhaust", "Suspension", "Brakes", "Lighting", "Exterior & Aero", "Wheels"];
const BRANDS = ["Borla", "MagnaFlow", "Invidia", "KW", "Bilstein", "Tein", "Brembo", "StopTech", "EBC", "Morimoto", "Diode Dynamics", "Rigid Industries", "Seibon", "APR Performance", "Rocket Bunny", "Enkei", "Volk Racing", "BBS"];
const SORT_OPTIONS = [
  { value: "rating", label: "Top Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

function ProductListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { vehicle, isVehicleSelected } = useVehicle();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryParam = searchParams.get("category") || "";
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [fitmentFilter, setFitmentFilter] = useState<"all" | "fits" | "universal">("all");
  const [sort, setSort] = useState("rating");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrands.length > 0) params.set("brand", selectedBrands.join(","));
    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
    if (priceRange[1] < 5000) params.set("maxPrice", String(priceRange[1]));
    if (inStockOnly) params.set("inStock", "true");
    params.set("sort", sort);
    if (fitmentFilter === "fits" && isVehicleSelected) {
      params.set("fitmentOnly", "true");
      params.set("vehicleYear", String(vehicle.year));
      params.set("vehicleMake", vehicle.make || "");
      params.set("vehicleModel", vehicle.model || "");
      if (vehicle.submodel) params.set("vehicleSubmodel", vehicle.submodel);
    }
    const searchQuery = searchParams.get("search");
    if (searchQuery) params.set("search", searchQuery);

    try {
      const res = await fetch(`/api/products?${params}`);
      let data: Product[] = await res.json();
      if (fitmentFilter === "universal") {
        data = data.filter((p) => p.isUniversal);
      }
      setProducts(data);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [selectedCategory, selectedBrands, priceRange, inStockOnly, sort, fitmentFilter, isVehicleSelected, vehicle, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrands([]);
    setPriceRange([0, 5000]);
    setInStockOnly(false);
    setFitmentFilter("all");
    router.push("/products");
  };

  const hasActiveFilters = selectedCategory || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000 || inStockOnly || fitmentFilter !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {selectedCategory || "All Parts"}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {loading ? "Loading..." : `${products.length} products found`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="md:hidden flex items-center gap-2 bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-700 text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`${filtersOpen ? "fixed inset-0 z-50 bg-slate-900 p-6 overflow-y-auto" : "hidden"} md:block md:static md:w-64 shrink-0`}>
          <div className="flex items-center justify-between mb-6 md:hidden">
            <h2 className="text-lg font-bold text-white">Filters</h2>
            <button onClick={() => setFiltersOpen(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full mb-4 text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
            >
              Clear All Filters
            </button>
          )}

          <div className="space-y-6">
            {/* Category */}
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Category</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                    !selectedCategory ? "bg-red-600/20 text-red-400 font-medium" : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                      selectedCategory === cat ? "bg-red-600/20 text-red-400 font-medium" : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Price Range</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400">Min: ${priceRange[0]}</label>
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={50}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full accent-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Max: ${priceRange[1]}</label>
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={50}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Brand</h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
                {BRANDS.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-500 focus:ring-red-500 accent-red-500"
                    />
                    <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* In Stock */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    inStockOnly ? "bg-red-600" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      inStockOnly ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="text-sm text-slate-300">In Stock Only</span>
              </label>
            </div>

            {/* Fitment */}
            {isVehicleSelected && (
              <div>
                <h3 className="text-white font-semibold text-sm mb-3">Fitment Status</h3>
                <div className="space-y-1.5">
                  {(["all", "fits", "universal"] as const).map((val) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="fitment"
                        checked={fitmentFilter === val}
                        onChange={() => setFitmentFilter(val)}
                        className="w-4 h-4 border-slate-600 bg-slate-700 text-red-500 focus:ring-red-500 accent-red-500"
                      />
                      <span className="text-sm text-slate-400">
                        {val === "all" && "Show All"}
                        {val === "fits" && "Guaranteed to Fit"}
                        {val === "universal" && "Universal"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setFiltersOpen(false)}
            className="md:hidden w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-bold"
          >
            Apply Filters
          </button>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl animate-pulse h-72" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <p className="text-slate-400 text-lg mb-2">No products found</p>
              <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={clearFilters}
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductListingPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><div className="animate-pulse h-96 bg-slate-800/50 rounded-xl" /></div>}>
      <ProductListingContent />
    </Suspense>
  );
}
