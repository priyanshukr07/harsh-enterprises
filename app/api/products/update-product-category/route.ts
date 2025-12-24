import { prisma } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { productId, categoryId, newName } = await req.json();

    // ------------------------------
    // Validation
    // ------------------------------
    if (!productId || !categoryId) {
      return NextResponse.json(
        { message: "Product ID and Category ID are required" },
        { status: 400 }
      );
    }

    if (!newName || newName.trim() === "") {
      return NextResponse.json(
        { message: "New category name cannot be empty" },
        { status: 400 }
      );
    }

    // ------------------------------
    // 1️⃣ Check Product existence
    // ------------------------------
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // ------------------------------
    // 2️⃣ Ensure category belongs to this product
    // ------------------------------
    const categoryLink = product.categories.find(
      (pc) => pc.categoryId === categoryId
    );

    if (!categoryLink) {
      return NextResponse.json(
        { message: "This category is not associated with the product" },
        { status: 404 }
      );
    }

    // ------------------------------
    // 3️⃣ Update the category name
    // ------------------------------
    await prisma.category.update({
      where: { id: categoryId },
      data: { name: newName },
    });

    return NextResponse.json(
      { message: "Category updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update product category:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the category", error },
      { status: 500 }
    );
  }
};
