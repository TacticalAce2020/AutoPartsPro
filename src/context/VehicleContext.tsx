"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { VehicleSelection } from "@/lib/types";

interface VehicleContextType {
  vehicle: VehicleSelection;
  setYear: (year: number | null) => void;
  setMake: (make: string | null) => void;
  setModel: (model: string | null) => void;
  setSubmodel: (submodel: string | null) => void;
  isVehicleSelected: boolean;
  vehicleLabel: string;
  clearVehicle: () => void;
  saveVehicle: () => void;
  isSaved: boolean;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

const INITIAL: VehicleSelection = { year: null, make: null, model: null, submodel: null };

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicle, setVehicle] = useState<VehicleSelection>(INITIAL);
  const [isSaved, setIsSaved] = useState(false);

  const setYear = useCallback((year: number | null) => {
    setVehicle((v) => ({ ...v, year, make: null, model: null, submodel: null }));
    setIsSaved(false);
  }, []);

  const setMake = useCallback((make: string | null) => {
    setVehicle((v) => ({ ...v, make, model: null, submodel: null }));
    setIsSaved(false);
  }, []);

  const setModel = useCallback((model: string | null) => {
    setVehicle((v) => ({ ...v, model, submodel: null }));
    setIsSaved(false);
  }, []);

  const setSubmodel = useCallback((submodel: string | null) => {
    setVehicle((v) => ({ ...v, submodel }));
    setIsSaved(false);
  }, []);

  const clearVehicle = useCallback(() => {
    setVehicle(INITIAL);
    setIsSaved(false);
  }, []);

  const saveVehicle = useCallback(() => {
    setIsSaved(true);
  }, []);

  const isVehicleSelected = !!(vehicle.year && vehicle.make && vehicle.model);

  const vehicleLabel = isVehicleSelected
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.submodel ? ` ${vehicle.submodel}` : ""}`
    : "";

  return (
    <VehicleContext.Provider
      value={{
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
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicle() {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error("useVehicle must be used within VehicleProvider");
  return ctx;
}
