import { Router } from "express";

import type { CreateUserController } from "../controllers/CreateUserController.js";
import type { FindUserByEmailController } from "../controllers/FindUserByEmailController.js";

export const createUserRoutes = (
  createUserController: CreateUserController,
  findUserByEmailController: FindUserByEmailController
): Router => {
  const router = Router();

  router.get("/search", findUserByEmailController.handle);
  router.post("/", createUserController.handle);

  return router;
};
