import { CreateUserUseCase } from "../modules/users/application/use-cases/CreateUserUseCase.js";
import { InMemoryUserRepository } from "../modules/users/infrastructure/repositories/InMemoryUserRepository.js";
import { CreateUserController } from "../modules/users/interfaces/http/controllers/CreateUserController.js";

export const makeDependencies = () => {
  const userRepository = new InMemoryUserRepository();
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const createUserController = new CreateUserController(createUserUseCase);

  return {
    createUserController
  };
};
