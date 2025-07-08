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

type OrganizationType =
  | "CHAMBER"
  | "HOSPITAL"
  | "CLINIC"
  | "LABORATORY"
  | "PHARMACY"
  | "DIAGNOSTIC_CENTER"
  | "BLOOD_BANK"
  | "AMBULANCE_SERVICE"
  | "HOMEOPATHY"
  | "AYURVEDIC"
  | "DENTAL"
  | "VETERINARY";

type OrganizationStatus =
  | "ACTIVE"
  | "PENDING"
  | "INACTIVE"
  | "DELETED"
  | "SUSPENDED";

interface Organization {
  uid: string;
  slug: string;
  name: string;
  title: string | null;
  logo: string | null;
  subdomain: string | null;
  organization_type: OrganizationType;
  status: OrganizationStatus;
  address: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  description: string | null;
}

interface User {
  uid: string;
  name: string;
  phone: string;
  email: string | null;
  gender: "MALE" | "FEMALE" | null;
  nid: string | null;
  nid_front: string | null;
  nid_back: string | null;
  avatar: string | null;
  blood_group: string | null;
  date_of_birth: string | null;
  is_admin: boolean;
  is_owner: boolean;
  organization: Organization;
}

interface LoginCredentials {
  phone: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
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
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const [status, response] = await getData("/public/auth/me");

      if (status === 200) {
        const { organization, ...userOnly } = response;
        setUser(userOnly);
        setOrganization(organization);

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
        message: `Welcome to Sebagriho!`, // This message is shown after successful login
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
      value={{
        user,
        organization,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
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
