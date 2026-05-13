export type Permission = "ESTOQUE" | "FINANCEIRO" | "RELATORIO" | "USUARIOS";

export type User = {
  id: string;
  name: string;
  email: string;
  permissions: Permission[];
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  cpf: string;
  password: string;
};
