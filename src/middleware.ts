import { NextRequest, NextResponse } from "next/server";

const ADMIN_PREFIX = "/dashboard";
const PROTECTED_PREFIXES = ["/dashboard", "/orders", "/account"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;

  if (!token || !userCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith(ADMIN_PREFIX)) {
    try {
      const user = JSON.parse(userCookie);
      if (user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/orders/:path*", "/account/:path*"],
};