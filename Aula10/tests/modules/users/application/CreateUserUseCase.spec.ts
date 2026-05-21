import { describe, expect, it } from "vitest";

import { CreateUserUseCase } from "../../../../src/modules/users/application/use-cases/CreateUserUseCase.js";
import { EmailAlreadyInUseError } from "../../../../src/modules/users/application/errors/EmailAlreadyInUseError.js";
import { InMemoryUserRepository } from "../../../../src/modules/users/infrastructure/repositories/InMemoryUserRepository.js";

describe("CreateUserUseCase", () => {
  it("creates a user with normalized email", async () => {
    const repository = new InMemoryUserRepository();
    const useCase = new CreateUserUseCase(repository);

    const user = await useCase.execute({
      name: "Ada Lovelace",
      email: " ADA@EXAMPLE.COM "
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe("ada@example.com");
  });

  it("rejects duplicate emails", async () => {
    const repository = new InMemoryUserRepository();
    const useCase = new CreateUserUseCase(repository);

    await useCase.execute({
      name: "Ada Lovelace",
      email: "ada@example.com"
    });

    await expect(
      useCase.execute({
        name: "Another Ada",
        email: "ada@example.com"
      })
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });
});
