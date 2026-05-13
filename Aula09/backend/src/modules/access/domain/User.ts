export const MODULES = ["ESTOQUE", "FINANCEIRO", "RELATORIO", "USUARIOS"] as const;

export type ModuleAccess = (typeof MODULES)[number];

export type Role = "admin" | "buyer" | "seller";

export type UserEntity = {
  id: number;
  name: string;
  email: string;
  cpf: string;
  role: Role;
  permissions: ModuleAccess[];
  createdAt: Date;
  updatedAt: Date;
};

export function isModuleAccess(value: string): value is ModuleAccess {
  return MODULES.includes(value as ModuleAccess);
}
