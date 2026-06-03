import type { Request, Response } from "express";
import { describe, expect, it } from "vitest";

import { CreateUserUseCase } from "../../../../../src/modules/users/application/use-cases/CreateUserUseCase.js";
import { FindUserByEmailUseCase } from "../../../../../src/modules/users/application/use-cases/FindUserByEmailUseCase.js";
import { UserNotFoundError } from "../../../../../src/modules/users/application/errors/UserNotFoundError.js";
import { InMemoryUserRepository } from "../../../../../src/modules/users/infrastructure/repositories/InMemoryUserRepository.js";
import { FindUserByEmailController } from "../../../../../src/modules/users/interfaces/http/controllers/FindUserByEmailController.js";

type MockResponse = Response & {
  statusCode?: number;
  body?: unknown;
};

const makeResponse = (): MockResponse => {
  const response = {} as MockResponse;

  response.status = ((statusCode: number) => {
    response.statusCode = statusCode;
    return response;
  }) as Response["status"];

  response.json = ((body: unknown) => {
    response.body = body;
    return response;
  }) as Response["json"];

  return response;
};

describe("FindUserByEmailController", () => {
  it("returns 200 when the user is found", async () => {
    const repository = new InMemoryUserRepository();
    const createUserUseCase = new CreateUserUseCase(repository);
    const findUserByEmailUseCase = new FindUserByEmailUseCase(repository);
    const controller = new FindUserByEmailController(findUserByEmailUseCase);
    const response = makeResponse();

    await createUserUseCase.execute({
      name: "Grace Hopper",
      email: "grace@example.com"
    });

    await controller.handle(
      {
        query: {
          email: "grace@example.com"
        }
      } as Request,
      response
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      name: "Grace Hopper",
      email: "grace@example.com"
    });
  });

  it("returns 404 when the email does not exist", async () => {
    const repository = new InMemoryUserRepository();
    const findUserByEmailUseCase = new FindUserByEmailUseCase(repository);
    const controller = new FindUserByEmailController(findUserByEmailUseCase);
    const response = makeResponse();

    await controller.handle(
      {
        query: {
          email: "missing@example.com"
        }
      } as Request,
      response
    );

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: new UserNotFoundError().message
    });
  });
});
