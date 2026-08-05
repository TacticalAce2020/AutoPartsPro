import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { sql, ilike, eq, and, gte, lte, asc, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = params.get("category");
  const brand = params.get("brand");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const inStock = params.get("inStock");
  const sort = params.get("sort");
  const search = params.get("search");
  const vehicleYear = params.get("vehicleYear");
  const vehicleMake = params.get("vehicleMake");
  const vehicleModel = params.get("vehicleModel");
  const vehicleSubmodel = params.get("vehicleSubmodel");
  const fitmentOnly = params.get("fitmentOnly");

  const conditions = [];

  if (category) {
    conditions.push(eq(products.category, category));
  }
  if (brand) {
    const brands = brand.split(",");
    conditions.push(sql`${products.brand} = ANY(${brands})`);
  }
  if (minPrice) {
    conditions.push(gte(products.price, minPrice));
  }
  if (maxPrice) {
    conditions.push(lte(products.price, maxPrice));
  }
  if (inStock === "true") {
    conditions.push(sql`${products.stockCount} > 0`);
  }
  if (search) {
    conditions.push(
      sql`(${ilike(products.title, `%${search}%`)} OR ${ilike(products.brand, `%${search}%`)} OR ${ilike(products.sku, `%${search}%`)})`
    );
  }

  let orderBy;
  switch (sort) {
    case "price_asc":
      orderBy = asc(products.price);
      break;
    case "price_desc":
      orderBy = desc(products.price);
      break;
    case "rating":
      orderBy = desc(products.rating);
      break;
    case "newest":
      orderBy = desc(products.createdAt);
      break;
    default:
      orderBy = desc(products.rating);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  let results = await db
    .select()
    .from(products)
    .where(whereClause)
    .orderBy(orderBy);

  // Filter by vehicle fitment in application layer (JSON filtering)
  if (fitmentOnly === "true" && vehicleYear && vehicleMake && vehicleModel) {
    results = results.filter((p) => {
      if (p.isUniversal) return true;
      const fitment = p.fitment as { year: number; make: string; model: string; submodel: string }[];
      return fitment.some(
        (f) =>
          f.year === parseInt(vehicleYear) &&
          f.make === vehicleMake &&
          f.model === vehicleModel &&
          (!vehicleSubmodel || f.submodel === vehicleSubmodel)
      );
    });
  }

  return NextResponse.json(results);
}
