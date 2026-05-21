import type { Request, Response } from "express";
import { describe, expect, it } from "vitest";

import { EmailAlreadyInUseError } from "../../../../../src/modules/users/application/errors/EmailAlreadyInUseError.js";
import { CreateUserUseCase } from "../../../../../src/modules/users/application/use-cases/CreateUserUseCase.js";
import { InMemoryUserRepository } from "../../../../../src/modules/users/infrastructure/repositories/InMemoryUserRepository.js";
import { CreateUserController } from "../../../../../src/modules/users/interfaces/http/controllers/CreateUserController.js";

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

describe("CreateUserController", () => {
  it("returns 201 when the user is created", async () => {
    const repository = new InMemoryUserRepository();
    const useCase = new CreateUserUseCase(repository);
    const controller = new CreateUserController(useCase);
    const request = {
      body: {
        name: "Grace Hopper",
        email: "grace@example.com"
      }
    } as Request;
    const response = makeResponse();

    await controller.handle(request, response);

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      name: "Grace Hopper",
      email: "grace@example.com"
    });
  });

  it("returns 409 when the email already exists", async () => {
    const repository = new InMemoryUserRepository();
    const useCase = new CreateUserUseCase(repository);
    const controller = new CreateUserController(useCase);
    const response = makeResponse();

    await useCase.execute({
      name: "Grace Hopper",
      email: "grace@example.com"
    });

    await controller.handle(
      {
        body: {
          name: "Another Grace",
          email: "grace@example.com"
        }
      } as Request,
      response
    );

    expect(response.statusCode).toBe(409);
    expect(response.body).toEqual({
      message: new EmailAlreadyInUseError().message
    });
  });
});
