import prisma from "../../../config/prisma";
import { ModuleAccess, UserEntity } from "../domain/User";
import { CreateUserInput, UserCredentials, UserRepository } from "../application/UserRepository";

function toEntity(data: {
  id: number;
  name: string;
  email: string;
  cpf: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: { module: string }[];
}): UserEntity {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    cpf: data.cpf,
    role: data.role as UserEntity["role"],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    permissions: data.permissions.map((item) => item.module as ModuleAccess),
  };
}

export class PrismaUserRepository implements UserRepository {
  async create(input: CreateUserInput): Promise<UserEntity> {
    const created = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        cpf: input.cpf,
        password: input.passwordHash,
        role: input.role ?? "buyer",
        permissions: {
          create: (input.permissions ?? []).map((module) => ({ module })),
        },
      },
      include: {
        permissions: true,
      },
    });

    return toEntity(created);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { permissions: true },
    });

    return user ? toEntity(user) : null;
  }

  async findCredentialsByEmail(email: string): Promise<UserCredentials | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { permissions: true },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserCredentials["role"],
      passwordHash: user.password,
      permissions: user.permissions.map((item) => item.module as ModuleAccess),
    };
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { permissions: true },
    });

    return user ? toEntity(user) : null;
  }

  async replacePermissions(userId: number, permissions: ModuleAccess[]): Promise<UserEntity> {
    await prisma.$transaction([
      prisma.userPermission.deleteMany({ where: { userId } }),
      ...(permissions.length > 0
        ? [
            ...permissions.map((module) =>
              prisma.userPermission.create({
                data: { userId, module },
              }),
            ),
          ]
        : []),
    ]);

    const updated = await prisma.user.findUnique({
      where: { id: userId },
      include: { permissions: true },
    });

    if (!updated) {
      throw new Error("User not found after permission update");
    }

    return toEntity(updated);
  }
}
