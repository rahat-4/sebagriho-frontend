import { cookies } from "next/headers";
import { jwtVerify } from "jose";

function isUser(payload: any): payload is User {
  return (
    typeof payload.user_uid === "string" &&
    typeof payload.is_admin === "boolean" &&
    typeof payload.is_owner === "boolean" &&
    typeof payload.exp === "number"
  );
}

interface User {
  user_uid: string;
  is_admin: boolean;
  is_owner: boolean;
  organization_uid?: string;
  exp: number;
}

export async function getUser(): Promise<User | null> {
  try {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.SECRET_KEY!);
    const { payload } = await jwtVerify(token, secret);
    if (isUser(payload)) {
      return payload;
    }
    return null;
  } catch {
    return null;
  }
}
