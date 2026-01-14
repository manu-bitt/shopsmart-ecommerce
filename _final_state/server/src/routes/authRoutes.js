import express from 'express';
import { authUser, registerUser } from '../controllers/authController.js';
import validateRequest from '../middleware/validateRequest.js';
import { loginSchema, registerSchema } from '../schemas/authSchema.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', validateRequest(loginSchema), authUser);

export default router;
