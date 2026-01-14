import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const promoteUser = async () => {
  const email = 'test@example.com';
  
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    console.log(`User ${user.email} is now ${user.role}`);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

promoteUser();
