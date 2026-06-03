import type { User } from "../../domain/entities/User.js";
import type { UserRepository } from "../../domain/repositories/UserRepository.js";
import { UserNotFoundError } from "../errors/UserNotFoundError.js";

type FindUserByEmailInput = {
  email: string;
};

export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(input: FindUserByEmailInput): Promise<User> {
    const normalizedEmail = input.email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      throw new Error("A valid user email is required.");
    }

    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
