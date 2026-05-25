import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const STATIC_FILE_REGEX = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    STATIC_FILE_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  const maintenanceUrl = new URL("/", request.url);

  return NextResponse.rewrite(maintenanceUrl);
}

export const config = {
  matcher: "/:path*",
};
