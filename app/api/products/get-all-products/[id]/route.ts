import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/db.config";
import { getCache, setCache } from "@/lib/cache";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // Next.js 16 requirement

    // -----------------------------
    // 1️⃣ Try Redis Cache First
    // -----------------------------
    const cached = await getCache(`product:${id}`);
    if (cached) {
      return NextResponse.json(
        { success: true, product: JSON.parse(cached), source: "cache" },
        { status: 200 }
      );
    }

    // -----------------------------
    // 2️⃣ Fetch From DB With Full Relations
    // -----------------------------
    const product = await prisma.product.findUnique({
      where: { id },
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
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // -----------------------------
    // 3️⃣ Normalize Response Format
    // -----------------------------
    const normalizedProduct = {
      ...product,
      categories: product.categories.map((pc) => pc.category),
    };

    // -----------------------------
    // 4️⃣ Cache Product for 2 Minutes
    // -----------------------------
    await setCache(`product:${id}`, JSON.stringify(normalizedProduct), 120);

    // -----------------------------
    // 5️⃣ Send Response
    // -----------------------------
    return NextResponse.json(
      { success: true, product: normalizedProduct, source: "db" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Product API] Failed to fetch product:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching the product." },
      { status: 500 }
    );
  }
}