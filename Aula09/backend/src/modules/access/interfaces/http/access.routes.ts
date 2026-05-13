import { Request, Response, Router } from "express";
import { AccessUseCases } from "../../application/AccessUseCases";
import { PrismaUserRepository } from "../../infrastructure/PrismaUserRepository";
import { ensureAuthenticated } from "../../../../shared/http/middlewares/ensureAuthenticated";
import { AppError } from "../../../../shared/errors/AppError";

const router = Router();
const useCases = new AccessUseCases(new PrismaUserRepository());

function handleError(error: unknown, res: Response) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: "Erro interno do servidor." });
}

router.post("/register", async (req: Request, res: Response) => {
  try {
    const result = await useCases.register(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return handleError(error, res);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const result = await useCases.login(req.body);
    return res.json(result);
  } catch (error) {
    return handleError(error, res);
  }
});

router.get("/me", ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = await new PrismaUserRepository().findById(req.auth!.userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.json(user);
  } catch (error) {
    return handleError(error, res);
  }
});

router.get("/modules", ensureAuthenticated, (req: Request, res: Response) => {
  return res.json(useCases.getModulesForUser(req.auth!.permissions));
});

export default router;
