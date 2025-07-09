import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function isDecodedToken(payload: any): payload is DecodedToken {
  return (
    typeof payload.user_uid === "string" &&
    typeof payload.is_admin === "boolean" &&
    typeof payload.is_owner === "boolean" &&
    typeof payload.exp === "number"
  );
}

interface DecodedToken {
  user_uid: string;
  is_admin: boolean;
  is_owner: boolean;
  organization_uid?: string;
  exp: number;
}

async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY!);
    const { payload } = await jwtVerify(token, secret);
    if (isDecodedToken(payload)) {
      return payload;
    }
    return null;
  } catch {
    return null;
  }
}

// ADD THIS NEW FUNCTION - Token refresh functionality
async function refreshAccessToken(
  refreshToken: string,
  rememberMe: boolean = false
): Promise<{
  success: boolean;
  accessToken?: string;
  newRefreshToken?: string;
}> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/public/auth/token/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refresh_token=${refreshToken}${
            rememberMe ? "; remember_me=true" : ""
          }`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    if (response.ok) {
      // Parse all Set-Cookie headers
      const setCookieHeaders = response.headers.getSetCookie();
      let accessToken = "";
      let newRefreshToken = "";

      for (const cookieHeader of setCookieHeaders) {
        const accessMatch = cookieHeader.match(/access_token=([^;]+)/);
        const refreshMatch = cookieHeader.match(/refresh_token=([^;]+)/);

        if (accessMatch) {
          accessToken = accessMatch[1];
        }
        if (refreshMatch) {
          newRefreshToken = refreshMatch[1];
        }
      }

      if (accessToken && newRefreshToken) {
        return {
          success: true,
          accessToken,
          newRefreshToken,
        };
      }
    }
    return { success: false };
  } catch (error) {
    console.error("Token refresh failed:", error);
    return { success: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth for public routes
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
  // ADD THIS LINE - Get refresh token and remember_me
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const rememberMe = request.cookies.get("remember_me")?.value === "true";

  // MODIFY THIS SECTION - Handle missing access token with refresh attempt
  if (!accessToken) {
    // Try to refresh if refresh token exists
    if (refreshToken) {
      const refreshResult = await refreshAccessToken(refreshToken, rememberMe);

      if (refreshResult.success && refreshResult.accessToken) {
        // Verify the new access token
        const decoded = await verifyToken(refreshResult.accessToken);
        if (decoded) {
          // Create response with new tokens
          const response = createResponseWithTokens(
            NextResponse.next(),
            refreshResult.accessToken,
            refreshResult.newRefreshToken,
            rememberMe
          );

          // Add user info to headers
          addUserHeaders(response, decoded);

          // Check authorization and return
          return checkAuthorization(decoded, pathname, response, request);
        }
      }
    }
    // No valid tokens, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = await verifyToken(accessToken);

  // MODIFY THIS SECTION - Handle invalid access token with refresh attempt
  if (!decoded) {
    // Try to refresh if refresh token exists
    if (refreshToken) {
      const refreshResult = await refreshAccessToken(refreshToken, rememberMe);

      if (refreshResult.success && refreshResult.accessToken) {
        const newDecoded = await verifyToken(refreshResult.accessToken);

        if (newDecoded) {
          // Create response with new tokens
          const response = createResponseWithTokens(
            NextResponse.next(),
            refreshResult.accessToken,
            refreshResult.newRefreshToken,
            rememberMe
          );

          // Add user info to headers
          addUserHeaders(response, newDecoded);

          // Check authorization and return
          return checkAuthorization(newDecoded, pathname, response, request);
        }
      }
    }
    // Both tokens are invalid, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Token is valid, continue with your existing logic
  // Admin access only
  if (pathname.startsWith("/admin") && decoded.is_admin !== true) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Organization's owner access
  const orgMatch = pathname.match(/^\/([^\/]+)$/);

  if (
    orgMatch &&
    decoded.is_owner === true &&
    decoded.organization_uid !== orgMatch[1]
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Add user info to headers for use in components
  const response = NextResponse.next();
  response.headers.set("x-user-uid", String(decoded.user_uid));
  response.headers.set(
    "x-user-role",
    decoded.is_admin ? "admin" : decoded.is_owner ? "owner" : "user"
  );
  if (decoded.organization_uid) {
    response.headers.set("x-organization-uid", decoded.organization_uid);
  }

  return response;
}

// ADD THESE HELPER FUNCTIONS
function createResponseWithTokens(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string,
  rememberMe: boolean = false
): NextResponse {
  const isDev = process.env.NODE_ENV === "development";

  // Match Django's cookie settings exactly
  const cookieSettings = {
    httpOnly: true,
    secure: !isDev, // False in development, True in production
    sameSite: isDev ? ("lax" as const) : ("none" as const), // Lax in development, None in production
    path: "/",
  };

  // Set access token with appropriate max age
  const accessMaxAge = rememberMe ? 60 * 60 * 24 : 60 * 15; // 24 hours or 15 minutes
  response.cookies.set("access_token", accessToken, {
    ...cookieSettings,
    maxAge: accessMaxAge,
  });

  // Set refresh token with appropriate max age
  if (refreshToken) {
    const refreshMaxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24; // 7 days or 1 day
    response.cookies.set("refresh_token", refreshToken, {
      ...cookieSettings,
      maxAge: refreshMaxAge,
    });
  }

  // Set remember_me cookie if applicable
  if (rememberMe) {
    response.cookies.set("remember_me", "true", {
      httpOnly: false, // This needs to be readable by JS
      secure: cookieSettings.secure,
      sameSite: cookieSettings.sameSite,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return response;
}

function addUserHeaders(response: NextResponse, decoded: DecodedToken): void {
  response.headers.set("x-user-uid", String(decoded.user_uid));
  response.headers.set(
    "x-user-role",
    decoded.is_admin ? "admin" : decoded.is_owner ? "owner" : "user"
  );
  if (decoded.organization_uid) {
    response.headers.set("x-organization-uid", decoded.organization_uid);
  }
}

function checkAuthorization(
  decoded: DecodedToken,
  pathname: string,
  response: NextResponse,
  request: NextRequest
): NextResponse {
  // Admin access only
  if (pathname.startsWith("/admin") && decoded.is_admin !== true) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Organization's owner access
  const orgMatch = pathname.match(/^\/([^\/]+)$/);

  if (
    orgMatch &&
    decoded.is_owner === true &&
    decoded.organization_uid !== orgMatch[1]
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};

// // In your page components
// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { getData } from '@/services/api';

// const useRoleGuard = (requiredRole: string) => {
//   const router = useRouter();

//   useEffect(() => {
//     const checkUserRole = async () => {
//       try {
//         const [status, response] = await getData('/public/auth/me');

//         if (status !== 200) {
//           router.push('/auth/login');
//           return;
//         }

//         if (response.role !== requiredRole) {
//           router.push('/unauthorized'); // Create an unauthorized page
//           return;
//         }
//       } catch (error) {
//         console.error('Role check failed:', error);
//         router.push('/auth/login');
//       }
//     };

//     checkUserRole();
//   }, [requiredRole, router]);
// };

// // Use in your admin pages
// export default function AdminPage() {
//   useRoleGuard('admin');

//   return (
//     <div>Admin Content</div>
//   );
// }
