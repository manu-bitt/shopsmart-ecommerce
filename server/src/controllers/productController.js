import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getProducts = async (req,res) => {
  const products = await prisma.product.findMany();
  res.json(products);
};