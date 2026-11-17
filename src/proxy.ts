import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE_HOME_PATH, USER_ROLE, UserRole } from "@/features/auth/types";

const PUBLIC_PATHS = ["/login", "/api"];
const VALID_STUDIO_ROLES = new Set<string>(Object.values(USER_ROLE));

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const rawRole = request.cookies.get("wordtap_studio_role")?.value;
  const role: UserRole | undefined =
    rawRole && VALID_STUDIO_ROLES.has(rawRole) ? (rawRole as UserRole) : undefined;
  const token = request.cookies.get("wordtap_studio_access_token")?.value;
  const isAuthenticated = Boolean(role && token);

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // Redirect authenticated users away from login
  if (pathname === "/login" && isAuthenticated && role) {
    return NextResponse.redirect(new URL(ROLE_HOME_PATH[role], request.url));
  }

  // Redirect unauthenticated (or invalid role cookie) requests to login
  if (!isPublic && !isAuthenticated && pathname !== "/") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Route root path based on auth status
  if (pathname === "/") {
    if (isAuthenticated && role) {
      return NextResponse.redirect(new URL(ROLE_HOME_PATH[role], request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Restricción para postulantes en espera (/pending-approval)
  if (pathname.startsWith(ROLE_HOME_PATH[USER_ROLE.CANDIDATE])) {
    if (role && role !== USER_ROLE.CANDIDATE) {
      return NextResponse.redirect(new URL(ROLE_HOME_PATH[role], request.url));
    }
    return NextResponse.next();
  }

  // Si el rol es candidato, restringir navegación exclusivamente a /pending-approval
  if (role === USER_ROLE.CANDIDATE) {
    return NextResponse.redirect(new URL(ROLE_HOME_PATH[USER_ROLE.CANDIDATE], request.url));
  }

  // Enforce role-based path access
  if (pathname.startsWith("/teacher")) {
    if (role !== USER_ROLE.INSTRUCTOR && role !== USER_ROLE.ADMIN) {
      const target = role ? ROLE_HOME_PATH[role] : "/login";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  if (pathname.startsWith("/moderator")) {
    if (role !== USER_ROLE.MODERATOR && role !== USER_ROLE.ADMIN) {
      const target = role ? ROLE_HOME_PATH[role] : "/login";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (role !== USER_ROLE.ADMIN) {
      const target = role ? ROLE_HOME_PATH[role] : "/login";
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
