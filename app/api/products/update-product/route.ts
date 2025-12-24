import { prisma } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { productId, updateData } = await req.json();

    if (!productId || !updateData) {
      return NextResponse.json(
        { message: "Product ID and update data are required" },
        { status: 400 }
      );
    }

    // -------------------------------
    // 1️⃣ Check product existence
    // -------------------------------
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        threadAttributes: true,
        cocopeatAttributes: true,
        trayAttributes: true,
        categories: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // -------------------------------
    // 2️⃣ Extract update fields
    // -------------------------------
    const {
      name,
      description,
      price,
      quantity,
      mainImage,
      otherImages,
      sizes,
      colors,
      categories,
      categoryType,

      // THREADS
      denier,
      length,
      material,
      plyCount,
      spoolWeight,
      strength,

      // COCOPEAT
      weight,
      ecLevel,
      compression,
      moisture,
      ph,

      // SEEDLING TRAY
      cavities,
      cellVolume,
      trayMaterial,
      dimensions,
      thickness,
    } = updateData;

    // -------------------------------
    // 3️⃣ Update base product fields
    // -------------------------------
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price }),
        ...(quantity !== undefined && { quantity }),
        ...(mainImage && { mainImage }),
        ...(otherImages && { otherImages }),
        ...(sizes && { sizes }),
        ...(colors && { colors }),
      },
    });

    // -------------------------------
    // 4️⃣ Update Categories (MANY-TO-MANY)
    // -------------------------------
    if (categories && Array.isArray(categories)) {
      // delete old relations
      await prisma.productCategory.deleteMany({
        where: { productId },
      });

      // insert new ones
      await prisma.productCategory.createMany({
        data: categories.map((catId: string) => ({
          productId,
          categoryId: catId,
        })),
      });
    }

    // -------------------------------
    // 5️⃣ Update category-specific attributes
    // -------------------------------
    if (categoryType === "threads") {
      if (!product.threadAttributes) {
        await prisma.threadAttributes.create({
          data: { productId },
        });
      }
      await prisma.threadAttributes.update({
        where: { productId },
        data: {
          ...(denier && { denier }),
          ...(length && { length }),
          ...(material && { material }),
          ...(plyCount && { plyCount }),
          ...(spoolWeight && { spoolWeight }),
          ...(strength && { strength }),
        },
      });
    }

    if (categoryType === "cocopeat") {
      if (!product.cocopeatAttributes) {
        await prisma.cocopeatAttributes.create({
          data: { productId },
        });
      }
      await prisma.cocopeatAttributes.update({
        where: { productId },
        data: {
          ...(weight && { weight }),
          ...(ecLevel && { ecLevel }),
          ...(compression && { compression }),
          ...(moisture && { moisture }),
          ...(ph && { ph }),
        },
      });
    }

    if (categoryType === "seedling-tray") {
      if (!product.trayAttributes) {
        await prisma.trayAttributes.create({
          data: { productId },
        });
      }
      await prisma.trayAttributes.update({
        where: { productId },
        data: {
          ...(cavities && { cavities }),
          ...(cellVolume && { cellVolume }),
          ...(trayMaterial && { trayMaterial }),
          ...(dimensions && { dimensions }),
          ...(thickness && { thickness }),
        },
      });
    }

    // -------------------------------
    // 6️⃣ Response
    // -------------------------------
    return NextResponse.json(
      {
        message: "Product updated successfully",
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PRODUCT UPDATE ERROR:", error);
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
};
