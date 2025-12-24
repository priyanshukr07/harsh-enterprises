import { prisma } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/Redis";

export const DELETE = async (req: NextRequest) => {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // ----------------------------------
    // 1️⃣ Check if product exists
    // ----------------------------------
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // ----------------------------------
    // 2️⃣ Delete related attributes
    // ----------------------------------
    await prisma.threadAttributes.deleteMany({
      where: { productId },
    });

    await prisma.cocopeatAttributes.deleteMany({
      where: { productId },
    });

    await prisma.trayAttributes.deleteMany({
      where: { productId },
    });

    // ----------------------------------
    // 3️⃣ Delete join-table entries (ProductCategory)
    // ----------------------------------
    await prisma.productCategory.deleteMany({
      where: { productId },
    });

    // ----------------------------------
    // 4️⃣ Delete the product
    // ----------------------------------
    await prisma.product.delete({
      where: { id: productId },
    });

    // ----------------------------------
    // 5️⃣ Invalidate Redis cache
    // ----------------------------------
    await client.del("products");
    await client.del(`product:${productId}`);

    return NextResponse.json(
      { message: "Product and related data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
};
