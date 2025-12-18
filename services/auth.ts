import { postData } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await postData("/auth/login/", credentials);
  const [status, data] = response;

  console.log("Login response status:", status);
  console.log("Login response data:", data);

  return data as AuthResponse;
}
