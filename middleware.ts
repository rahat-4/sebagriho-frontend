import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // if (url.pathname !== "/") {
  //   return NextResponse.next();
  // }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/public/auth/me`,
      {
        method: "GET",
        headers: {
          // 🔑 Forward cookies from browser → middleware → Django
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    console.log("Middleware auth check status:", response.status);

    if (response.status !== 200) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const data = await response.json();

    console.log("Authenticated user:", data);
  } catch (error) {
    console.error("Middleware auth check failed:", error);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
      Match all paths except:
      - /login
      - /api
      - /_next (static files)
      - /favicon.ico
    */
    "/((?!login|api|_next|favicon.ico).*)",
  ],
};
