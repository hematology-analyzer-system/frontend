// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// const PROTECTED_PATHS = ["/dashboard", "/admin", "/profile"];
const PROTECTED_PATHS = ["/patients", "/iam", "/testorders"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isProtected = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/errors/401", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*"],
  matcher: ["/patients/:path*", "/iam/:path*", "/testorders/:path*"],
};
