"use client";

import { useVehicle } from "@/context/VehicleContext";
import { YEARS, MAKES_MODELS } from "@/lib/types";
import { Car, X, Check, ChevronDown } from "lucide-react";

export default function YMMSelector() {
  const {
    vehicle,
    setYear,
    setMake,
    setModel,
    setSubmodel,
    isVehicleSelected,
    vehicleLabel,
    clearVehicle,
    saveVehicle,
    isSaved,
  } = useVehicle();

  const makes = Object.keys(MAKES_MODELS);
  const models = vehicle.make ? Object.keys(MAKES_MODELS[vehicle.make]) : [];
  const submodels = vehicle.make && vehicle.model ? MAKES_MODELS[vehicle.make][vehicle.model] || [] : [];

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-slate-300 text-sm font-medium shrink-0">
            <Car size={16} className="text-red-400" />
            <span className="hidden sm:inline">Your Vehicle:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap flex-1">
            <div className="relative">
              <select
                value={vehicle.year ?? ""}
                onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : null)}
                className="appearance-none bg-slate-700 border border-slate-600 text-white text-sm rounded-md pl-3 pr-8 py-1.5 focus:ring-2 focus:ring-red-500 focus:outline-none cursor-pointer"
              >
                <option value="">Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={vehicle.make ?? ""}
                onChange={(e) => setMake(e.target.value || null)}
                disabled={!vehicle.year}
                className="appearance-none bg-slate-700 border border-slate-600 text-white text-sm rounded-md pl-3 pr-8 py-1.5 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-40 cursor-pointer"
              >
                <option value="">Make</option>
                {makes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={vehicle.model ?? ""}
                onChange={(e) => setModel(e.target.value || null)}
                disabled={!vehicle.make}
                className="appearance-none bg-slate-700 border border-slate-600 text-white text-sm rounded-md pl-3 pr-8 py-1.5 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-40 cursor-pointer"
              >
                <option value="">Model</option>
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={vehicle.submodel ?? ""}
                onChange={(e) => setSubmodel(e.target.value || null)}
                disabled={!vehicle.model}
                className="appearance-none bg-slate-700 border border-slate-600 text-white text-sm rounded-md pl-3 pr-8 py-1.5 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-40 cursor-pointer"
              >
                <option value="">Submodel</option>
                {submodels.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isVehicleSelected && !isSaved && (
              <button
                onClick={saveVehicle}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-sm px-3 py-1.5 rounded-md transition-colors font-medium"
              >
                <Check size={14} />
                Save My Vehicle
              </button>
            )}
            {isSaved && (
              <span className="flex items-center gap-1.5 bg-green-600/20 text-green-400 text-sm px-3 py-1.5 rounded-md border border-green-600/30 font-medium">
                <Car size={14} />
                Garage Active
              </span>
            )}
            {isVehicleSelected && (
              <button
                onClick={clearVehicle}
                className="text-slate-400 hover:text-white p-1.5 rounded-md hover:bg-slate-700 transition-colors"
                title="Clear vehicle"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        {isVehicleSelected && (
          <p className="text-xs text-slate-400 mt-1 ml-6 sm:ml-0">
            Showing parts for: <span className="text-white font-medium">{vehicleLabel}</span>
          </p>
        )}
      </div>
    </div>
  );
}
