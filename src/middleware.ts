// // middleware.ts
// import { NextRequest, NextResponse } from "next/server";

// const PROTECTED_PATHS = ["/patients", "/iam", "/testorders"];

// export function middleware(request: NextRequest) {
//   // Get the Authorization header from the request
//   const authorizationHeader = request.headers.get("authorization");

//   // Check if the header exists and starts with "Bearer "
//   const token = authorizationHeader?.startsWith("Bearer ")
//     ? authorizationHeader.substring(7)
//     : null;

//   const isProtected = PROTECTED_PATHS.some((path) =>
//     request.nextUrl.pathname.startsWith(path)
//   );

//   if (isProtected && !token) {
//     // return NextResponse.redirect(new URL("/errors/401", request.url));
//   }

//   // Allow the request to proceed if it's not a protected path
//   // or a valid token is present
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/patients/:path*", "/iam/:path*", "/testorders/:path*"],
// };

// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/patients", "/iam", "/testorders"];
const LOGIN_PATH = "/login";
const PROFILE_PATH = "/iam/users/profile";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Try getting the token from cookies (more reliable than headers in Next.js)
  // const token = request.cookies.get("token")?.value || null;
    const authorizationHeader = request.headers.get("authorization");

  // Check if the header exists and starts with "Bearer "
  const token = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.substring(7)
    : null;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  // If logged in and trying to access login page → redirect to profile
  if (pathname === LOGIN_PATH && token) {
    return NextResponse.redirect(new URL(PROFILE_PATH, request.url));
  }

  // If not logged in and trying to access protected page → redirect to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  // Otherwise, continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/patients/:path*",
    "/iam/:path*",
    "/testorders/:path*",
  ],
};
