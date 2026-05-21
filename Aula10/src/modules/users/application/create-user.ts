import { InMemoryUserRepository } from "../infrastructure/repositories/InMemoryUserRepository.js";
import { CreateUserUseCase } from "./use-cases/CreateUserUseCase.js";

export const criaAdmin = async () => {
    const userRepository = new InMemoryUserRepository();
    const useCase = new CreateUserUseCase(userRepository);
    await useCase.execute({
        name: "admin",
        email: "admin@admin"
    });
}

