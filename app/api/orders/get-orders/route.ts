import { prisma } from "@/db/db.config";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { userId } = await req.json();
  try {
    if (!userId) {
      return NextResponse.json(
        { message: "User id is required" },
        { status: 400 }
      );
    }
    const orders = await prisma.order.findMany({
      where: {
        usersId: userId,
      },
      include: {
        Product: {
          select: {
            name: true,
            price: true,
            mainImage: true,
          },
        },
        address: true,
      },
    });
    return NextResponse.json({ orders, status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching orders" },
      { status: 500 }
    );
  }
};
