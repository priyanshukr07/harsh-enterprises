/* -------------------------------------------------------
   Runtime configuration (NON-NEGOTIABLE)
------------------------------------------------------- */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------
   Imports
------------------------------------------------------- */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/db.config";
import { getCache, setCache } from "@/lib/cache";

/* -------------------------------------------------------
   DB fetch + normalization
------------------------------------------------------- */
async function fetchProductsFromDB(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
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
    }),
    prisma.product.count(),
  ]);

  // Normalize pivot table → clean category array
  const normalized = products.map((p) => ({
    ...p,
    categories: p.categories.map((pc) => pc.category),
  }));

  return { products: normalized, total };
}

/* -------------------------------------------------------
   GET handler
------------------------------------------------------- */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, parseInt(searchParams.get("page")  ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));

    const cacheKey = `products:page=${page}:limit=${limit}`;

    // 1️⃣ Attempt cache
    const cached = await getCache(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return NextResponse.json(
        {
          success: true,
          ...parsed,
          source: "cache",
        },
        { status: 200 }
      );
    }

    // 2️⃣ Fallback to DB
    const { products, total } = await fetchProductsFromDB(page, limit);

    const payload = {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };

    // 3️⃣ Update cache (120s TTL)
    await setCache(cacheKey, JSON.stringify(payload), 120);

    return NextResponse.json(
      {
        success: true,
        ...payload,
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