import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function isDecodedToken(payload: any): payload is DecodedToken {
  return (
    typeof payload.user_uid === "string" &&
    typeof payload.name === "string" &&
    typeof payload.is_admin === "boolean" &&
    typeof payload.is_owner === "boolean" &&
    typeof payload.exp === "number"
  );
}

interface DecodedToken {
  user_uid: string;
  name: string;
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

  // Block unauthenticated users
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = await verifyToken(accessToken);

  if (!decoded) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

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
