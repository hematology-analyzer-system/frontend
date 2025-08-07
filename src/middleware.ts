// // middleware.ts
// import { NextRequest, NextResponse } from "next/server";

// // const PROTECTED_PATHS = ["/dashboard", "/admin", "/profile"];
// const PROTECTED_PATHS = ["/patients", "/iam", "/testorders"];

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;

//   const isProtected = PROTECTED_PATHS.some((path) =>
//     request.nextUrl.pathname.startsWith(path)
//   );

//   if (isProtected && !token) {
//     return NextResponse.redirect(new URL("/errors/401", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   // matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*"],
//   matcher: ["/patients/:path*", "/iam/:path*", "/testorders/:path*"],
// };

import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/patients", "/iam", "/testorders"];

export function middleware(request: NextRequest) {
  // Get the Authorization header from the request
  const authorizationHeader = request.headers.get("authorization");

  // Check if the header exists and starts with "Bearer "
  const token = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.substring(7)
    : null;

  const isProtected = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    // return NextResponse.redirect(new URL("/errors/401", request.url));
  }

  // Allow the request to proceed if it's not a protected path
  // or a valid token is present
  return NextResponse.next();
}

export const config = {
  matcher: ["/patients/:path*", "/iam/:path*", "/testorders/:path*"],
};