import { CreateUserUseCase } from "../modules/users/application/use-cases/CreateUserUseCase.js";
import { FindUserByEmailUseCase } from "../modules/users/application/use-cases/FindUserByEmailUseCase.js";
import { InMemoryUserRepository } from "../modules/users/infrastructure/repositories/InMemoryUserRepository.js";
import { CreateUserController } from "../modules/users/interfaces/http/controllers/CreateUserController.js";
import { FindUserByEmailController } from "../modules/users/interfaces/http/controllers/FindUserByEmailController.js";

export const makeDependencies = () => {
  const userRepository = new InMemoryUserRepository();
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const findUserByEmailUseCase = new FindUserByEmailUseCase(userRepository);
  const createUserController = new CreateUserController(createUserUseCase);
  const findUserByEmailController = new FindUserByEmailController(findUserByEmailUseCase);

  return {
    createUserController,
    findUserByEmailController
  };
};
