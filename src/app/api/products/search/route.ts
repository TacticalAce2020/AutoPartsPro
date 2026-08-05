import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { ilike, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const results = await db
    .select({
      id: products.id,
      title: products.title,
      brand: products.brand,
      sku: products.sku,
      category: products.category,
      price: products.price,
    })
    .from(products)
    .where(
      sql`(${ilike(products.title, `%${query}%`)} OR ${ilike(products.brand, `%${query}%`)} OR ${ilike(products.sku, `%${query}%`)})`
    )
    .limit(8);

  return NextResponse.json(results);
}
