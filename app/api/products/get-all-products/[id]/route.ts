import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/db.config";
import { client } from "@/lib/Redis";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // Next.js 16 requirement

    // -----------------------------
    // 1️⃣ Try Redis Cache First
    // -----------------------------
    const cached = await client.get(`product:${id}`);
    if (cached) {
      return NextResponse.json(JSON.parse(cached), { status: 200 });
    }

    // -----------------------------
    // 2️⃣ Fetch From DB With Full Relations
    // -----------------------------
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true, // get actual category object
          },
        },
        threadAttributes: true,
        cocopeatAttributes: true,
        trayAttributes: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
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
    await client.set(
      `product:${id}`,
      JSON.stringify(normalizedProduct),
      "EX",
      120
    );

    // -----------------------------
    // 5️⃣ Send Response
    // -----------------------------
    return NextResponse.json(normalizedProduct, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the product.", error },
      { status: 500 }
    );
  }
}
