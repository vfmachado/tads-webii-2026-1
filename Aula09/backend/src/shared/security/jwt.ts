import jwt from "jsonwebtoken";
import { ModuleAccess } from "../../modules/access/domain/User";

export type JwtPayload = {
  sub: string;
  role: string;
  permissions: ModuleAccess[];
};

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "8h",
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
