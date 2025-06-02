import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|api).*)"],
};


export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // Allow the following paths without auth
  const publicPaths = ["/", "/login", "/register"];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  // 1️⃣ Redirect unauthenticated users
  if (!token && !isPublic) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // 2️⃣ Role-based route protection (example: /admin should only be accessible by ADMIN)
  if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
    const unauthorizedUrl = req.nextUrl.clone();
    unauthorizedUrl.pathname = "/unauthorized"; // Create this page to show "Access Denied"
    return NextResponse.redirect(unauthorizedUrl);
  }

  return NextResponse.next();
}
