const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { postData } from "./api";

export interface LoginCredentials {
  phone: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user_name: string;
  admin: boolean;
}

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

export interface Organization {
  uid: string;
  slug: string;
  name: string;
  title: string | null;
  logo: { url: string } | null;
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

export interface User {
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

export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
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

  const response = await postData("/public/auth/login", formData);
  const [status, data] = response;

  if (status !== 200) {
    throw new Error(JSON.stringify(data));
  }

  console.log("Login response status:", status);
  console.log("Login response data:", data);

  return data as AuthResponse;
}

export async function logout(): Promise<void> {
  try {
    await postData("/private/auth/logout", null);
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}

export async function refreshToken(): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/refresh/`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  return response.json();
}

export async function getCurrentUser(): Promise<User | null> {
  const response = await postData("/private/auth/me", null);
  const [status, data] = response;

  if (status !== 200) {
    throw new Error("Failed to fetch current user");
  }
  return data as User | null;
}

export async function protectedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  let response = await fetch(`${API_URL}${url}`, fetchOptions);

  // If unauthorized, try refreshing token once
  if (response.status === 401) {
    try {
      await refreshToken();
      // Retry original request
      response = await fetch(`${API_URL}${url}`, fetchOptions);
    } catch (error) {
      // Refresh failed, user needs to login again
      throw new Error("Session expired");
    }
  }

  return response;
}

export async function getCurrentUserServer(): Promise<User | null> {
  // Dynamic import to ensure this only runs on server
  const { cookies } = await import("next/headers");

  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const response = await fetch(
      `${process.env.API_URL || API_URL}/api/auth/me/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieString, // Forward cookies from request
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user (server):", error);
    return null;
  }
}
