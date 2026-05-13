import { Request, Response, Router } from "express";
import { z } from "zod";
import prisma from "../../../../config/prisma";
import { AppError } from "../../../../shared/errors/AppError";
import { ensureAuthenticated } from "../../../../shared/http/middlewares/ensureAuthenticated";
import { hashPassword } from "../../../../utils/password";
import { AccessUseCases } from "../../application/AccessUseCases";
import { isModuleAccess, ModuleAccess } from "../../domain/User";
import { PrismaUserRepository } from "../../infrastructure/PrismaUserRepository";

const router = Router();
const userRepository = new PrismaUserRepository();
const useCases = new AccessUseCases(userRepository);

const createUserSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres."),
  email: z.string().trim().email("E-mail inválido."),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
  role: z.enum(["buyer", "seller"]).optional(),
  permissions: z.array(z.string()).optional(),
  cpf: z.string().trim().length(11, "CPF deve conter 11 dígitos.").optional(),
});

function generateCpf() {
  const value = `${Date.now()}${Math.floor(Math.random() * 1000)}`.replace(/\D/g, "");
  return value.slice(-11).padStart(11, "0");
}

function handleError(error: unknown, res: Response) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: "Erro interno do servidor." });
}

router.get("/", ensureAuthenticated, async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { permissions: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json(
      users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions.map((p) => p.module),
      })),
    );
  } catch (error) {
    return handleError(error, res);
  }
});

router.post("/", ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    if (req.auth!.role !== "admin") {
      return res.status(403).json({ message: "Apenas admin pode criar usuários." });
    }

    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((issue) => issue.message).join(" ");
      return res.status(400).json({ message: message || "Dados inválidos para criação de usuário." });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "E-mail já cadastrado." });
    }

    const permissions = (parsed.data.permissions ?? []).filter(isModuleAccess) as ModuleAccess[];

    const created = await userRepository.create({
      name: parsed.data.name.trim(),
      email,
      cpf: parsed.data.cpf ?? generateCpf(),
      passwordHash: hashPassword(parsed.data.password),
      role: parsed.data.role ?? "buyer",
      permissions,
    });

    return res.status(201).json({
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
      permissions: created.permissions,
    });
  } catch (error) {
    return handleError(error, res);
  }
});

router.patch("/:id/permissions", ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const result = await useCases.updatePermissions(req.auth!.role, {
      targetUserId: Number(req.params.id),
      permissions: req.body.permissions,
    });

    return res.json({
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      permissions: result.permissions,
    });
  } catch (error) {
    return handleError(error, res);
  }
});

export default router;
