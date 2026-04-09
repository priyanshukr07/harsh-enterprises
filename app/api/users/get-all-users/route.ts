import { prisma } from "@/db/db.config";
import { getCache, setCache } from "@/lib/cache";
import { NextResponse } from "next/server";

/* ---------- Types ---------- */
type SortBy = "createdAt" | "role" | "name" | "email";
type SortOrder = "asc" | "desc";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const page       = Math.max(1, Number(searchParams.get("page"))   || 1);
    const limit      = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 10));
    const search     = searchParams.get("search")    || "";
    const role       = searchParams.get("role");
    const sortBy     = (searchParams.get("sortBy")   || "createdAt") as SortBy;
    const sortOrder  = (searchParams.get("sortOrder")|| "desc")      as SortOrder;

    const skip = (page - 1) * limit;

    /* ---------- Redis Cache ---------- */
    const cacheKey = `users:${page}:${limit}:${search}:${role}:${sortBy}:${sortOrder}`;

    const cached = await getCache(cacheKey);
    if (cached) {
      return NextResponse.json(
        { ...JSON.parse(cached), source: "cache" },
        { status: 200 }
      );
    }

    /* ---------- Prisma Filters ---------- */
    const where: any = {};

    if (search) {
      where.OR = [
        { name:  { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const validRoles = ["admin", "user", "manager"];
    if (role && validRoles.includes(role)) where.role = role;

    /* ---------- Queries ---------- */
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id:        true,
          name:      true,
          email:     true,
          role:      true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    const response = {
      success:    true,
      users,
      total,
      page,
      limit,
      totalPages:  Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
      source:      "db",
    };

    /* ---------- Cache Result (5 min TTL) ---------- */
    await setCache(cacheKey, JSON.stringify(response), 300);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[Users API] Failed to fetch users:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};