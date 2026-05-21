import type { User } from "../../domain/entities/User.js";
import type { UserRepository } from "../../domain/repositories/UserRepository.js";

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  public async findByEmail(email: string): Promise<User | null> {
    return this.users.get(email) ?? null;
  }

  public async create(user: User): Promise<void> {
    this.users.set(user.email, user);
  }
}
