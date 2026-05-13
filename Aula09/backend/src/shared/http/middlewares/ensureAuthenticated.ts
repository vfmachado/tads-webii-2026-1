import { NextFunction, Request, Response } from "express";
import { ModuleAccess } from "../../../modules/access/domain/User";
import { verifyAccessToken } from "../../security/jwt";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: number;
        role: string;
        permissions: ModuleAccess[];
      };
    }
  }
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não informado." });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.auth = {
      userId: Number(payload.sub),
      role: payload.role,
      permissions: payload.permissions,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Token inválido." });
  }
}
