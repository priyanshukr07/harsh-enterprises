import { prisma } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";
import { deleteCache, deleteCacheByPattern } from "@/lib/cache";

export const DELETE = async (req: NextRequest) => {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
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
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // ----------------------------------
    // 2️⃣ Delete related records in parallel
    // ----------------------------------
    await Promise.all([
      prisma.threadAttributes.deleteMany({ where: { productId } }),
      prisma.cocopeatAttributes.deleteMany({ where: { productId } }),
      prisma.trayAttributes.deleteMany({ where: { productId } }),
      prisma.productCategory.deleteMany({ where: { productId } }),
    ]);

    // ----------------------------------
    // 3️⃣ Delete the product
    // ----------------------------------
    await prisma.product.delete({
      where: { id: productId },
    });

    // ----------------------------------
    // 4️⃣ Invalidate Redis cache (SAFE)
    // ----------------------------------
    await Promise.all([
      deleteCache(`product:${productId}`),        // single product key
      deleteCacheByPattern("products:page=*"),    // all paginated list keys
    ]);

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Delete Product API] Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
};