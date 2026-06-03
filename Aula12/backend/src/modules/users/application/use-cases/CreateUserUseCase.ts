import { User } from "../../domain/entities/User.js";
import type { UserRepository } from "../../domain/repositories/UserRepository.js";
import { EmailAlreadyInUseError } from "../errors/EmailAlreadyInUseError.js";

type CreateUserInput = {
  name: string;
  email: string;
};

export class CreateUserUseCase {
  // INJECAO DO REPOSITORY
  // O REPOSITORY É UMA INTERFACE 
  // FACILITA TESTES UNITÁRIOS / MOCKS
  constructor(private readonly userRepository: UserRepository) {}

  // execute é o nome padrao do método que o use case EXECUTA
  public async execute(input: CreateUserInput): Promise<User> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new EmailAlreadyInUseError();
    }

    const user = User.create({
      name: input.name,
      email: normalizedEmail
    });

    await this.userRepository.create(user);

    return user;
  }
}
