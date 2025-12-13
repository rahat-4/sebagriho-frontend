// lib/getUser.ts
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

interface User {
  user_uid: string;
  is_admin: boolean;
  is_owner: boolean;
  organization_uid?: string;
  exp: number;
}

export async function getUser(): Promise<User | null> {
  try {
    const token = cookies().get("access_token")?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.SECRET_KEY!);
    const { payload } = await jwtVerify(token, secret);
    return payload as User;
  } catch {
    return null;
  }
}

// lib/apiFetch.ts
import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

export async function apiFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const cookieStore = cookies();

  let res = await fetch(`${API_URL}${input}`, {
    ...init,
    headers: { ...init.headers, cookie: cookieStore.toString() },
    credentials: "include",
    cache: "no-store",
  });

  if (res.status !== 401) return res;

  // Refresh token
  const refreshRes = await fetch(`${API_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { cookie: cookieStore.toString() },
    credentials: "include",
    cache: "no-store",
  });

  if (!refreshRes.ok) throw new Error("Session expired");

  // Retry original request
  return fetch(`${API_URL}${input}`, {
    ...init,
    headers: { ...init.headers, cookie: cookieStore.toString() },
    credentials: "include",
    cache: "no-store",
  });
}

// context/AuthContext.tsx
("use client");

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { postData, getData } from "@/services/api";

interface AuthContextType {
  user: any | null;
  login: (credentials: any) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const checkAuth = async () => {
    const [status, response] = await getData("/public/auth/me");
    if (status === 200) setUser(response);
    else setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    const [status] = await postData("/public/auth/login", credentials);
    await checkAuth();
    return status === 200;
  };

  const logout = async () => {
    await postData("/public/auth/logout", {});
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// app/admin/layout.tsx
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user || !user.is_admin) {
    redirect("/login");
  }

  return <>{children}</>;
}

// app/[organizationId]/layout.tsx
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { organizationId: string };
}) {
  const user = await getUser();

  if (!user || user.organization_uid !== params.organizationId) {
    redirect("/login");
  }

  return <>{children}</>;
}

// app/login/page.tsx
("use client");

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ phone, password });
    if (success) router.push("/admin"); // or redirect based on user type
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

// app/admin/page.tsx
import { apiFetch } from "@/lib/apiFetch";

export default async function AdminDashboard() {
  const res = await apiFetch("/admin/dashboard");
  const data = await res.json();

  return <div>Welcome, {data.user_name}</div>;
}
