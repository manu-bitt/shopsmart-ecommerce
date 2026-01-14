import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import { createProductSchema, updateProductSchema } from '../schemas/productSchema.js';

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, admin, validateRequest(createProductSchema), createProduct);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, validateRequest(updateProductSchema), updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
