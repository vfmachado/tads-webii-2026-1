import type { Request, Response } from "express";

import { EmailAlreadyInUseError } from "../../../application/errors/EmailAlreadyInUseError.js";
import type { CreateUserUseCase } from "../../../application/use-cases/CreateUserUseCase.js";

export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  public handle = async (request: Request, response: Response): Promise<Response> => {
    try {
      const user = await this.createUserUseCase.execute({
        name: request.body.name,
        email: request.body.email
      });

      return response.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      });
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return response.status(409).json({ message: error.message });
      }

      if (error instanceof Error) {
        return response.status(400).json({ message: error.message });
      }

      return response.status(500).json({ message: "Unexpected error." });
    }
  };
}
