import { apiRequest } from "./api";
import type { Permission, User } from "@/src/types/auth";

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  permissions: Permission[];
};

export const userService = {
  list: (token: string) =>
    apiRequest<User[]>("/users", {
      method: "GET",
      token,
    }),

  create: (payload: CreateUserPayload, token: string) =>
    apiRequest<User>("/users", {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }),

  updatePermissions: (id: string, permissions: Permission[], token: string) =>
    apiRequest<User>(`/users/${id}/permissions`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ permissions }),
    }),
};
