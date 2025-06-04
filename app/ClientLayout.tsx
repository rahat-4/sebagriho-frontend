"use client";

import { AuthProvider } from "@/context/AuthContext";
// import { useTokenRefresh } from "@/services/useTokenRefresh";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useTokenRefresh();

  return <AuthProvider>{children}</AuthProvider>;
}
