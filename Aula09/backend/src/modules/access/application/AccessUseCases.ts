import { z } from "zod";
import { hashPassword, verifyPassword } from "../../../utils/password";
import { AppError } from "../../../shared/errors/AppError";
import { signAccessToken } from "../../../shared/security/jwt";
import { isModuleAccess, ModuleAccess, Role } from "../domain/User";
import { UserRepository } from "./UserRepository";

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  cpf: z.string().min(11).max(11),
  password: z.string().min(6),
  role: z.enum(["buyer", "seller"]).optional(),
  permissions: z.array(z.string()).optional(),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const updatePermissionsSchema = z.object({
  targetUserId: z.number().int().positive(),
  permissions: z.array(z.string()),
});

export class AccessUseCases {
  constructor(private readonly users: UserRepository) {}

  async register(input: unknown) {
    const parsed = registerSchema.safeParse(input);

    if (!parsed.success) {
      throw new AppError("Dados de cadastro inválidos.", 400);
    }

    const data = parsed.data;
    const email = data.email.trim().toLowerCase();

    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new AppError("E-mail já cadastrado.", 409);
    }

    const permissions = (data.permissions ?? []).filter(isModuleAccess);
    const created = await this.users.create({
      name: data.name.trim(),
      email,
      cpf: data.cpf.trim(),
      passwordHash: hashPassword(data.password),
      role: (data.role ?? "buyer") as Role,
      permissions,
    });

    const token = signAccessToken({
      sub: String(created.id),
      role: created.role,
      permissions: created.permissions,
    });

    return { token, user: created };
  }

  async login(input: unknown) {
    const parsed = loginSchema.safeParse(input);

    if (!parsed.success) {
      throw new AppError("Credenciais inválidas.", 400);
    }

    const email = parsed.data.email.trim().toLowerCase();
    const user = await this.users.findCredentialsByEmail(email);

    if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const token = signAccessToken({
      sub: String(user.id),
      role: user.role,
      permissions: user.permissions,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    };
  }

  async updatePermissions(actorRole: string, input: unknown) {
    if (actorRole !== "admin") {
      throw new AppError("Apenas administradores podem conceder acessos.", 403);
    }

    const parsed = updatePermissionsSchema.safeParse(input);

    if (!parsed.success) {
      throw new AppError("Dados de permissão inválidos.", 400);
    }

    const permissions = parsed.data.permissions.filter(isModuleAccess) as ModuleAccess[];

    const target = await this.users.findById(parsed.data.targetUserId);
    if (!target) {
      throw new AppError("Usuário alvo não encontrado.", 404);
    }

    return this.users.replacePermissions(parsed.data.targetUserId, permissions);
  }

  getModulesForUser(permissions: ModuleAccess[]) {
    return {
      modules: permissions,
    };
  }
}
