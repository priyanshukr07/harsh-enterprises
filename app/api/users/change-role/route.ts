import { prisma } from "@/db/db.config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/authOptions";
import { ROLE_HIERARCHY, ROLE_PERMISSIONS, isValidRole } from "@/lib/roles";
import { NextRequest, NextResponse } from "next/server";
import { deleteCacheByPattern } from "@/lib/cache";

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    //  Must be logged in
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUserRole = session.user.role;
    const { targetUserId, newRole } = await req.json();

    //  Validate inputs
    if (!targetUserId || !newRole) {
      return NextResponse.json(
        { success: false, message: "targetUserId and newRole are required" },
        { status: 400 }
      );
    }

    // Validate role values
    if (!isValidRole(newRole)) {
      return NextResponse.json(
        { success: false, message: "Invalid role provided" },
        { status: 400 }
      );
    }

    if (!isValidRole(currentUserRole)) {
      return NextResponse.json(
        { success: false, message: "Your current role is invalid" },
        { status: 403 }
      );
    }

    //  Check if current user can assign this role
    const allowed = ROLE_PERMISSIONS[currentUserRole].canAssign;
    if (!allowed.includes(newRole)) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to assign this role" },
        { status: 403 }
      );
    }

    //  Prevent self role change
    if (targetUserId === session.user.id) {
      return NextResponse.json(
        { success: false, message: "You cannot change your own role" },
        { status: 403 }
      );
    }

    //  Fetch target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    //  Validate target user's role
    if (!isValidRole(targetUser.role)) {
      return NextResponse.json(
        { success: false, message: "Target user has an invalid role" },
        { status: 400 }
      );
    }

    //  Prevent changing a higher-ranked user's role
    if (ROLE_HIERARCHY[targetUser.role] > ROLE_HIERARCHY[currentUserRole]) {
      return NextResponse.json(
        { success: false, message: "You cannot change the role of a higher-ranked user" },
        { status: 403 }
      );
    }

    //  Update role
    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data:  { role: newRole },
      select: {
        id:        true,
        name:      true,
        email:     true,
        role:      true,
        updatedAt: true,
      },
    });

    // Invalidate users cache
    await deleteCacheByPattern("users:*");

    return NextResponse.json(
      { success: true, message: `Role updated to ${newRole}`, user: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Change Role API] Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};