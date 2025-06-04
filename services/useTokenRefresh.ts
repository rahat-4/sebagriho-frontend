"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function useTokenRefresh() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          console.log("Token refresh failed, redirecting to login");
          router.push("/login");
          return;
        }

        console.log("Token refreshed successfully");
      } catch (error) {
        console.error("Token refresh error:", error);
        router.push("/login");
      }
    };

    // Refresh token every 10 minutes
    intervalRef.current = setInterval(refreshToken, 10 * 60 * 1000);

    // Also refresh on page focus (when user comes back to tab)
    const handleFocus = () => {
      refreshToken();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener("focus", handleFocus);
    };
  }, [router]);
}
