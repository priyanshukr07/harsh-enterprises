import { prisma } from "@/db/db.config";
import { client } from "@/lib/Redis";
import { NextResponse } from "next/server";

/* ---------- Types ---------- */
type SortBy = "createdAt" | "role" | "name" | "email";
type SortOrder = "asc" | "desc";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role"); // admin | user | null
    const sortBy = (searchParams.get("sortBy") ||
      "createdAt") as SortBy;
    const sortOrder = (searchParams.get("sortOrder") ||
      "desc") as SortOrder;

    const skip = (page - 1) * limit;

    /* ---------- Redis Cache Key ---------- */
    const cacheKey = `users:${page}:${limit}:${search}:${role}:${sortBy}:${sortOrder}`;

    const cachedUsers = await client.get(cacheKey);
    if (cachedUsers) {
      return NextResponse.json(JSON.parse(cachedUsers), { status: 200 });
    }

    /* ---------- Prisma Filters ---------- */
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role === "admin") where.role = "admin";
    if (role === "user") where.role = "user";
    if (role === "manager") where.role = "manager";

    /* ---------- Queries ---------- */
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    if (!users.length) {
      return NextResponse.json(
        {
          users: [],
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
        { status: 200 }
      );
    }

    const response = {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

    /* ---------- Cache Result ---------- */
    await client.setex(cacheKey, 300, JSON.stringify(response));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};