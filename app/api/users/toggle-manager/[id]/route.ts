import { NextResponse } from "next/server";
import { prisma } from "@/db/db.config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/authOptions";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // ❌ Not logged in
  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  // ❌ Only admins can change roles
  if (!session.user.role || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    );
  }

  const targetUserId = params.id;

  // 🚫 Prevent self-demotion (server-side)
  if (session.user.id === targetUserId) {
    return NextResponse.json(
      { message: "You cannot change your own role" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  await prisma.user.update({
    where: { id: targetUserId },
    data: {
      role: user.role === "USER" ? "MANAGER" : "USER", 
    },
  });

  return NextResponse.json({ success: true });
}
