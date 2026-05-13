import { apiRequest } from "./api";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/src/types/auth";

export const authService = {
  login: (payload: LoginPayload) =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  register: (payload: RegisterPayload) =>
    apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: (token: string) =>
    apiRequest<AuthResponse["user"]>("/auth/me", {
      method: "GET",
      token,
    }),
};
