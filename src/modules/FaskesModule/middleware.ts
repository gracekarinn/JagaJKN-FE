import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token");

  if (pathname.startsWith("/faskes") && pathname !== "/faskes") {
    if (!token) {
      return NextResponse.redirect(new URL("/faskes", request.url));
    }
  }

  if (pathname === "/faskes") {
    if (token) {
      return NextResponse.redirect(new URL("/faskes/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/faskes/:path*"],
};
