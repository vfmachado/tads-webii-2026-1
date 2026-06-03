import type { Request, Response } from "express";

import { UserNotFoundError } from "../../../application/errors/UserNotFoundError.js";
import type { FindUserByEmailUseCase } from "../../../application/use-cases/FindUserByEmailUseCase.js";

export class FindUserByEmailController {
  constructor(private readonly findUserByEmailUseCase: FindUserByEmailUseCase) {}

  public handle = async (request: Request, response: Response): Promise<Response> => {
    try {
      const user = await this.findUserByEmailUseCase.execute({
        email: String(request.query.email ?? "")
      });

      return response.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return response.status(404).json({ message: error.message });
      }

      if (error instanceof Error) {
        return response.status(400).json({ message: error.message });
      }

      return response.status(500).json({ message: "Unexpected error." });
    }
  };
}
