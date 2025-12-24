import { prisma } from "@/db/db.config";
import { client } from "@/lib/Redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // Next.js 16 requires awaiting params

    // Check Redis cache
    const cachedUser = await client.get(`user:${id}`);
    if (cachedUser) {
      return NextResponse.json(JSON.parse(cachedUser), { status: 200 });
    }

    // Fetch from DB
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        orders: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No User Found" },
        { status: 404 }
      );
    }

    // Cache for 30 seconds
    await client.setex(`user:${id}`, 30, JSON.stringify(user));

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
