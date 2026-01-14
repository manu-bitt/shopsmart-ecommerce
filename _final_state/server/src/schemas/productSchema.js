import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    imageUrl: z.string().url('Invalid image URL').optional(),
    category: z.string().min(1, 'Category is required'),
    stock: z.number().int().nonnegative('Stock cannot be negative').default(0),
  }),
});

export const updateProductSchema = createProductSchema.partial();
