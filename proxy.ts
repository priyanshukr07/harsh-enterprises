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

  /*  LOGIN PAGE  */
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  /*  AUTH-PROTECTED ROUTES  */
  const protectedRoutes = ["/cart", "/order", "/checkout", "/dashboard"];

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /*  DASHBOARD GUARD  */
  if (pathname.startsWith("/dashboard")) {
    const role = token?.role as string | undefined;
    const isAllowed = role === "ADMIN" || role === "MANAGER";

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  /*  ALLOW  */
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};