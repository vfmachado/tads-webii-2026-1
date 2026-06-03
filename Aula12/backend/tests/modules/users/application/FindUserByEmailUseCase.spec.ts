import { describe, expect, it } from "vitest";

import { CreateUserUseCase } from "../../../../src/modules/users/application/use-cases/CreateUserUseCase.js";
import { FindUserByEmailUseCase } from "../../../../src/modules/users/application/use-cases/FindUserByEmailUseCase.js";
import { UserNotFoundError } from "../../../../src/modules/users/application/errors/UserNotFoundError.js";
import { InMemoryUserRepository } from "../../../../src/modules/users/infrastructure/repositories/InMemoryUserRepository.js";

describe("FindUserByEmailUseCase", () => {
  it("finds a user with normalized email", async () => {
    const repository = new InMemoryUserRepository();
    const createUserUseCase = new CreateUserUseCase(repository);
    const findUserByEmailUseCase = new FindUserByEmailUseCase(repository);

    await createUserUseCase.execute({
      name: "Ada Lovelace",
      email: "ada@example.com"
    });

    const user = await findUserByEmailUseCase.execute({
      email: "  ADA@example.com  "
    });

    expect(user.name).toBe("Ada Lovelace");
    expect(user.email).toBe("ada@example.com");
  });

  it("throws when the user does not exist", async () => {
    const repository = new InMemoryUserRepository();
    const findUserByEmailUseCase = new FindUserByEmailUseCase(repository);

    await expect(
      findUserByEmailUseCase.execute({
        email: "missing@example.com"
      })
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
