/* -------------------------------------------------------
   Runtime configuration (NON-NEGOTIABLE)
------------------------------------------------------- */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------
   Imports
------------------------------------------------------- */
import { NextResponse } from "next/server";
import { prisma } from "@/db/db.config";
import { client } from "@/lib/Redis";

/* -------------------------------------------------------
   Cache helpers (SAFE, NON-FATAL)
------------------------------------------------------- */
async function getProductsFromCache() {
  try {
    if (!client) return null;

    const cache = await client.get("products");
    if (!cache) return null;

    return JSON.parse(cache);
  } catch (err) {
    console.warn("[Products API] Redis read failed");
    return null;
  }
}

async function setProductsToCache(products: unknown[]) {
  try {
    if (!client) return;

    await client.set(
      "products",
      JSON.stringify(products),
      "EX",
      120 // 2 minutes TTL
    );
  } catch (err) {
    console.warn("[Products API] Redis write failed");
  }
}

/* -------------------------------------------------------
   DB fetch + normalization
------------------------------------------------------- */
async function fetchProductsFromDB() {
  const products = await prisma.product.findMany({
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      threadAttributes: true,
      cocopeatAttributes: true,
      trayAttributes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Normalize pivot table → clean category array
  return products.map((p) => ({
    ...p,
    categories: p.categories.map((pc) => pc.category),
  }));
}

/* -------------------------------------------------------
   GET handler
------------------------------------------------------- */
export async function GET() {
  try {
    // 1️⃣ Attempt cache
    const cachedProducts = await getProductsFromCache();
    if (cachedProducts) {
      return NextResponse.json(
        {
          success: true,
          products: cachedProducts,
          total: cachedProducts.length,
          source: "cache",
        },
        { status: 200 }
      );
    }

    // 2️⃣ Fallback to DB
    const products = await fetchProductsFromDB();

    // 3️⃣ Update cache (even if empty — prevents DB hammering)
    await setProductsToCache(products);

    return NextResponse.json(
      {
        success: true,
        products,          // [] if none
        total: products.length,
        source: "db",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Products API] Fatal error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while fetching products",
      },
      { status: 500 }
    );
  }
}
