import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface DecodedToken {
  user_id: number;
  exp: number;
}

// Verify JWT token
async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY!);
    const { payload } = await jwtVerify(token, secret);
    if (
      typeof payload.user_id === "number" &&
      typeof payload.exp === "number"
    ) {
      return payload as unknown as DecodedToken;
    }
    return null;
  } catch {
    return null;
  }
}

// Refresh access token using backend
async function refreshAccessToken(refreshToken: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/public/auth/token/refresh`,
      {
        method: "POST",
        credentials: "include", // send cookies automatically
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );
    return response.ok; // backend sets new cookies
  } catch (err) {
    console.error("Token refresh failed:", err);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect frontend pages (not API, static, login, etc.)
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // No access token → try refresh
  if (!accessToken && refreshToken) {
    const refreshed = await refreshAccessToken(refreshToken);
    if (refreshed) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify access token
  if (accessToken) {
    const decoded = await verifyToken(accessToken);

    // Token invalid or expired → try refresh
    if (!decoded && refreshToken) {
      const refreshed = await refreshAccessToken(refreshToken);
      if (refreshed) return NextResponse.next();
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Token valid → continue
    if (decoded) {
      const response = NextResponse.next();
      // Optional: attach user info to headers for frontend
      response.headers.set("x-user-id", decoded.user_id.toString());
      return response;
    }
  }

  // No valid tokens
  return NextResponse.redirect(new URL("/login", request.url));
}

// Only apply middleware to frontend pages
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
