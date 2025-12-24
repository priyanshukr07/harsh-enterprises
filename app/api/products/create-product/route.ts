import { prisma } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_CATEGORY_TYPES = ["threads", "cocopeat", "seedling-tray"] as const;

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const {
      name,
      description,
      price,
      mainImage,
      otherImages = [],
      quantity,
      sizes = [],
      colors = [],
      userId,
      categories = [],
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
      expansion,
      grade,

      // SEEDLING TRAY
      cavities,
      cellVolume,
      trayMaterial,
      dimensions,
      thickness,
      rows,
      columns,
    } = body;

    // ------------------------------
    // BASIC VALIDATION
    // ------------------------------
    const missingFields: string[] = [];

    if (!name) missingFields.push("name");
    if (!description) missingFields.push("description");
    if (!price) missingFields.push("price");
    if (!mainImage) missingFields.push("mainImage");
    if (quantity === undefined || quantity === null)
      missingFields.push("quantity");
    if (!userId) missingFields.push("userId");
    if (!categories.length) missingFields.push("categories");
    if (!categoryType) missingFields.push("categoryType");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_CATEGORY_TYPES.includes(categoryType)) {
      return NextResponse.json(
        { message: "Invalid categoryType" },
        { status: 400 }
      );
    }

    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { message: "Invalid price value" },
        { status: 400 }
      );
    }

    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return NextResponse.json(
        { message: "Invalid quantity value" },
        { status: 400 }
      );
    }

    // ------------------------------
    // TRANSACTION (ATOMIC OPERATION)
    // ------------------------------
    const product = await prisma.$transaction(async (tx) => {
      // 1️⃣ Create base product
      const product = await tx.product.create({
        data: {
          name,
          description,
          price: parsedPrice,
          mainImage,
          otherImages: Array.isArray(otherImages)
            ? otherImages
            : [otherImages],
          quantity: parsedQuantity,
          sizes,
          colors,
          userId,
        },
      });

      // 2️⃣ Create category relations
      await tx.productCategory.createMany({
        data: categories.map((catId: string) => ({
          productId: product.id,
          categoryId: catId,
        })),
      });

      // 3️⃣ Create category-specific attributes
      switch (categoryType) {
        case "threads":
          await tx.threadAttributes.create({
            data: {
              productId: product.id,
              denier,
              length,
              material,
              plyCount,
              spoolWeight,
              strength,
            },
          });
          break;

        case "cocopeat":
          await tx.cocopeatAttributes.create({
            data: {
              productId: product.id,
              weight,
              ecLevel,
              compression,
              moisture,
              ph,
              expansion,
              grade,
            },
          });
          break;

        case "seedling-tray":
          await tx.trayAttributes.create({
            data: {
              productId: product.id,
              cavities,
              cellVolume,
              trayMaterial,
              dimensions,
              thickness,
              rows,
              columns,
            },
          });
          break;
      }

      return product;
    });

    // ------------------------------
    // SUCCESS RESPONSE
    // ------------------------------
    return NextResponse.json(
      {
        message: "Product created successfully",
        productId: product.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
};