import { prisma } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId, firstName, lastName, address, city, state, zip } =
      await req.json();

    const missingFields = [];

    if (!userId) missingFields.push("userId");
    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!address) missingFields.push("address");
    if (!city) missingFields.push("city");
    if (!state) missingFields.push("state");
    if (!zip) missingFields.push("zip");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: `All fields are required. Missing: ${missingFields.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 404 }
      );
    }

    const products = await prisma.cart.findMany({
      where: { userId: userId },
      select: { productId: true, quantity: true },
    });

    if (products.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 404 });
    }

    const userAddress = await prisma.orderAddress.create({
      data: { firstName, lastName, address, city, state, zip, userId: userId },
    });

    for (const product of products) {
      const productExists = await prisma.product.findUnique({
        where: { id: product.productId },
      });
      if (!productExists) continue;

      await prisma.order.create({
        data: {
          quantity: product.quantity,
          usersId: userId,
          productId: product.productId,
          addressId: userAddress.id,
        },
      });
    }

    await prisma.cart.deleteMany({
      where: { userId: userId },
    });

    return NextResponse.json(
      { message: "Orders and address created successfully, cart cleared" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error || "An error occurred" },
      { status: 500 }
    );
  }
};
