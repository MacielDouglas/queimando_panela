import { randomUUID } from 'node:crypto';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const E2E_USER_EMAIL = process.env.E2E_USER_EMAIL ?? 'e2e@queimandopanela.com';
const E2E_USER_PASSWORD = process.env.E2E_USER_PASSWORD ?? 'e2e-password-123';
const E2E_USER_NAME = process.env.E2E_USER_NAME ?? 'Usuário E2E';

async function main() {
  const hashedPassword = await hash(E2E_USER_PASSWORD, 12);

  const userId = randomUUID();

  const user = await prisma.user.upsert({
    where: { email: E2E_USER_EMAIL },
    update: {},
    create: {
      id: userId,
      email: E2E_USER_EMAIL,
      name: E2E_USER_NAME,
      emailVerified: true,
    },
  });

  const existingAccount = await prisma.account.findFirst({
    where: { userId: user.id, providerId: 'credential' },
  });

  if (existingAccount) {
    await prisma.account.update({
      where: { id: existingAccount.id },
      data: { password: hashedPassword },
    });
  } else {
    await prisma.account.create({
      data: {
        id: randomUUID(),
        userId: user.id,
        accountId: user.email,
        providerId: 'credential',
        password: hashedPassword,
      },
    });
  }

  console.log(`✅ Usuário E2E criado/atualizado: ${E2E_USER_EMAIL}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
