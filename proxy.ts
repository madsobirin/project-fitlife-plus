import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  let role: string | undefined;
  let userId: string | undefined;

  const tokenCookie = request.cookies.get("token")?.value;
  if (tokenCookie) {
    try {
      const { payload } = await jwtVerify(tokenCookie, secret);
      role = payload.role as string;
      userId = String(payload.userId);
    } catch {
      // Token invalid/expired — akan redirect sesuai kondisi di bawah
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect profile route
  if (pathname.startsWith("/profile")) {
    if (!userId) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Admin redirect ke dashboard
  if (pathname === "/" && role === "admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  const response = NextResponse.next();

  if (pathname.startsWith("/api")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/api/:path*", "/"],
};
