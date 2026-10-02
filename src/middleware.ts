import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/api"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const role = request.cookies.get("wordtap_studio_role")?.value;
  const token = request.cookies.get("wordtap_studio_access_token")?.value;
  const isAuthenticated = Boolean(role && token);

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // Redirect authenticated users away from login
  if (pathname === "/login" && isAuthenticated) {
    const target =
      role === "moderator" ? "/moderator" : role === "admin" ? "/dashboard" : "/teacher";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Redirect unauthenticated requests to login
  if (!isPublic && !isAuthenticated && pathname !== "/") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Route root path based on auth status
  if (pathname === "/") {
    if (isAuthenticated) {
      const target =
        role === "moderator" ? "/moderator" : role === "admin" ? "/dashboard" : "/teacher";
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Enforce role-based path access
  if (pathname.startsWith("/teacher")) {
    if (role !== "instructor" && role !== "admin") {
      const target = role === "moderator" ? "/moderator" : "/dashboard";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  if (pathname.startsWith("/moderator")) {
    if (role !== "moderator" && role !== "admin") {
      const target = role === "instructor" ? "/teacher" : "/dashboard";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  const ADMIN_ROUTES = [
    "/dashboard",
    "/roles",
    "/audit",
    "/monetization",
    "/approvals",
    "/vault",
    "/students",
    "/courses",
  ];

  if (ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    if (role !== "admin") {
      const target = role === "moderator" ? "/moderator" : "/teacher";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
