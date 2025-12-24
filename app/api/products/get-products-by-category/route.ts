import { prisma } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { category } = await req.json();

    if (!category) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // ------------------------------
    // Fetch products by category name
    // ------------------------------
    const products = await prisma.product.findMany({
      where: {
        categories: {
          some: {
            category: {
              name: category, // JOIN → ProductCategory.category.name
            },
          },
        },
      },
      include: {
        categories: {
          include: { category: true },
        },
        threadAttributes: true,
        cocopeatAttributes: true,
        trayAttributes: true,
      },
    });

    if (!products.length) {
      return NextResponse.json(
        { error: "No products found for this category" },
        { status: 404 }
      );
    }

    // Normalize category output
    const normalized = products.map((p) => ({
      ...p,
      categories: p.categories.map((pc) => pc.category),
    }));

    return NextResponse.json({ products: normalized }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
};
