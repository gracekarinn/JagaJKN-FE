import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname === "/login") {
    const token = request.cookies.get("token");
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
