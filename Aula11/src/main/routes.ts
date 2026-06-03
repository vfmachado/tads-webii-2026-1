import { Router } from "express";

import { createUserRoutes } from "../modules/users/interfaces/http/routes/userRoutes.js";
import type { makeDependencies } from "./container.js";

type RouteDependencies = ReturnType<typeof makeDependencies>;

export const createRoutes = (dependencies: RouteDependencies): Router => {
  const router = Router();

  router.get("/health", (_request, response) => {
    return response.json({ status: "ok" });
  });

  router.use("/users", createUserRoutes(dependencies.createUserController));

  return router;
};
