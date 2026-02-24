import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin routes — check admin-session cookie
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminSession = req.cookies.get("admin-session");
    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // User protected routes — check user-session cookie
  const userProtected = ["/checkout", "/orders", "/profile", "/cart"];
  if (userProtected.some((p) => pathname.startsWith(p))) {
    const userSession = req.cookies.get("user-session");
    if (!userSession) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/cart/:path*",
  ],
};
