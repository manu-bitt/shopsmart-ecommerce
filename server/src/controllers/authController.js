import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const registerUser = async (req,res) => {
  const user = await prisma.user.create({data: req.body});
  res.json(user);
};