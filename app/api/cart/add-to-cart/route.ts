import { prisma } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId, productId, quantity, color, size } = await req.json();

    if (!userId || !productId) {
      return new NextResponse(
        JSON.stringify({
          message: "User ID and Product ID are required",
        }),
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return new NextResponse(
        JSON.stringify({
          message: "User not found",
        }),
        { status: 404 }
      );
    }

    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!productExists) {
      return new NextResponse(
        JSON.stringify({
          message: "Product not found",
        }),
        { status: 404 }
      );
    }

    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId,
        productId,
        color,
        size,
      },
    });

    if (existingCartItem) {
      const updatedCartItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
      return new NextResponse(
        JSON.stringify({
          message: "Cart item updated with new quantity",
          data: updatedCartItem,
        }),
        { status: 200 }
      );
    } else {
      const newCartItem = await prisma.cart.create({
        data: {
          userId,
          productId,
          quantity,
          color,
          size,
        },
      });
      return new NextResponse(
        JSON.stringify({
          message: "New product added to cart",
          data: newCartItem,
        }),
        { status: 201 }
      );
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "An error occurred while processing your request",
      }),
      { status: 500 }
    );
  }
};
