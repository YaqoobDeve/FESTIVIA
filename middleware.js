// middleware.js
import { NextResponse } from "next/server";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // don't touch static, next internals, api, or the maintenance page itself
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/maintenance")
  ) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(`${req.nextUrl.origin}/api/db-status`, {
      cache: "no-store",
      method: "GET",
    });

    // non-OK -> maintenance
    if (!res.ok) {
      return NextResponse.rewrite(new URL("/maintenance", req.url));
    }

    const body = await res.json();
    if (!body || body.status !== "ok") {
      return NextResponse.rewrite(new URL("/maintenance", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    // any error -> maintenance
    console.error("Middleware DB check failed:", err);
    return NextResponse.rewrite(new URL("/maintenance", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|maintenance).*)"],
};
