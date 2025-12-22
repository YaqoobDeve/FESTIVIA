// middleware.js
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname, origin } = request.nextUrl;
  const token = request.cookies.get("token")?.value || "";

  // 1️⃣ Ignore internals & API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Define routes
  const publicPaths = ["/login", "/signup", "/verifyemail",];
  const protectedPaths = ["/venues/new","/dashboard"];

  const isPublicPath = publicPaths.includes(pathname);
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // 3️⃣ AUTH LOGIC (FIXED)
  // ❌ Not logged in → block protected pages
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Logged in → block auth pages
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4️⃣ DB HEALTH CHECK (UNCHANGED)
  try {
    const res = await fetch(`${origin}/api/db-status`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.rewrite(new URL("/maintenance", request.url));
    }

    const { status } = await res.json();
    if (status !== "ok") {
      return NextResponse.rewrite(new URL("/maintenance", request.url));
    }
  } catch {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
