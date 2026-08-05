export interface Vehicle {
  year: number;
  make: string;
  model: string;
  submodel: string;
}

export interface Product {
  id: number;
  sku: string;
  brand: string;
  title: string;
  description: string;
  category: string;
  price: string;
  msrp: string;
  stockCount: number;
  images: string[];
  fitment: Vehicle[];
  features: string[];
  specs: Record<string, string>;
  rating: string;
  reviewCount: number;
  isUniversal: boolean;
  createdAt: Date | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface VehicleSelection {
  year: number | null;
  make: string | null;
  model: string | null;
  submodel: string | null;
}

export const CATEGORIES = [
  "Exhaust",
  "Suspension",
  "Brakes",
  "Lighting",
  "Exterior & Aero",
  "Wheels",
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  "Exhaust": "🔧",
  "Suspension": "🏎️",
  "Brakes": "🛑",
  "Lighting": "💡",
  "Exterior & Aero": "🏁",
  "Wheels": "⚙️",
};

export const YEARS = Array.from({ length: 22 }, (_, i) => 2026 - i);

export const MAKES_MODELS: Record<string, Record<string, string[]>> = {
  Honda: {
    Civic: ["LX", "EX", "Sport", "Si", "Type R"],
    Accord: ["LX", "Sport", "EX-L", "Touring"],
    "CR-V": ["LX", "EX", "EX-L", "Touring"],
  },
  Toyota: {
    Camry: ["LE", "SE", "XLE", "TRD"],
    Corolla: ["L", "LE", "SE", "XSE"],
    RAV4: ["LE", "XLE", "Adventure", "TRD Off-Road"],
    Supra: ["2.0", "3.0", "3.0 Premium"],
  },
  Ford: {
    Mustang: ["EcoBoost", "GT", "Mach 1", "Shelby GT500"],
    F150: ["XL", "XLT", "Lariat", "Platinum"],
    Focus: ["S", "SE", "ST", "RS"],
  },
  BMW: {
    "3 Series": ["330i", "M340i", "M3"],
    "5 Series": ["530i", "540i", "M5"],
    X3: ["sDrive30i", "xDrive30i", "M40i"],
  },
  Subaru: {
    WRX: ["Base", "Premium", "Limited"],
    BRZ: ["Premium", "Limited"],
    Impreza: ["Base", "Premium", "Sport", "Limited"],
  },
};
