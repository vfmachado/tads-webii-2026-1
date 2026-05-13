import prisma from "../config/prisma";
import { MODULES } from "../modules/access/domain/User";
import { hashPassword } from "../utils/password";

const DEFAULT_ADMIN = {
  name: process.env.DEFAULT_ADMIN_NAME || "admin",
  email: (process.env.DEFAULT_ADMIN_EMAIL || "admin@admin.com").toLowerCase(),
  password: process.env.DEFAULT_ADMIN_PASSWORD || "admin",
  cpf: process.env.DEFAULT_ADMIN_CPF || "00000000000",
};

export async function ensureDefaultAdmin() {
  async function grantAllModules(userId: number) {
    await Promise.all(
      MODULES.map((module) =>
        prisma.userPermission.upsert({
          where: { userId_module: { userId, module } },
          update: {},
          create: { userId, module },
        }),
      ),
    );
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: DEFAULT_ADMIN.email }, { cpf: DEFAULT_ADMIN.cpf }],
    },
  });

  if (!existing) {
    const created = await prisma.user.create({
      data: {
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        cpf: DEFAULT_ADMIN.cpf,
        role: "admin",
        password: hashPassword(DEFAULT_ADMIN.password),
      },
    });

    await grantAllModules(created.id);

    console.log(`Default admin created: ${DEFAULT_ADMIN.email}`);
    return;
  }

  await prisma.user.update({
    where: { id: existing.id },
    data: { role: "admin" },
  });

  await grantAllModules(existing.id);

  console.log(`Default admin ensured: ${DEFAULT_ADMIN.email}`);
}
