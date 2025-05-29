"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { getData, postData } from "../services/api";

interface User {
  id: number;
  phone: string;
  // Add other user properties as needed
  [key: string]: any;
}

interface LoginCredentials {
  phone: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{
    success: boolean;
    errors?: Record<string, string[]>;
    message?: string;
  }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const [status, response] = await getData("/public/auth/me");

      console.log("---status---", status);
      console.log("---response---", response);

      if (status === 200) {
        setUser(response);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const formData = new FormData();

      // Handle phone number with country code
      const countryCode = "+88";
      const fullPhoneNumber = `${countryCode}${credentials.phone.replace(
        /\D/g,
        ""
      )}`;

      formData.append("phone", fullPhoneNumber);
      formData.append("password", credentials.password);
      formData.append("rememberMe", String(credentials.rememberMe || "false"));

      const [status, response] = await postData("/public/auth/login", formData);

      if (status !== 200) {
        return {
          success: false,
          errors: response,
        };
      }

      await checkAuth();

      return {
        success: true,
        message: "Login successful",
      };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Login failed. Please check your credentials and try again.",
      };
    }
  };

  const logout = async () => {
    try {
      await postData("/public/auth/logout", {});
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  return context;
};
