import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = req.nextUrl;

  /* ---------- LOGIN PAGE ---------- */
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  /* ---------- AUTH-PROTECTED ROUTES ---------- */
  const protectedRoutes = ["/cart", "/order", "/checkout", "/dashboard"];

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  /* ---------- ADMIN GUARD ---------- */
  if (pathname.startsWith("/dashboard") && !token?.role?.includes("ADMIN")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  /* ---------- ALLOW ---------- */
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
