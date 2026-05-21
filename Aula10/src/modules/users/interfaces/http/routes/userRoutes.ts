import { Router } from "express";

import type { CreateUserController } from "../controllers/CreateUserController.js";

export const createUserRoutes = (createUserController: CreateUserController): Router => {
  const router = Router();

  router.post("/", createUserController.handle);

  return router;
};
