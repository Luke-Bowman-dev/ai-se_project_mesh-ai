import { Router } from 'express';
import { getCurrentUser, authenticateUser, createUser } from '../controllers/auth.js';
import { auth } from '../middleware/auth.js';
import { loginLimiter, registerLimiter } from '../middleware/rate-limit.js';

const authRouter = Router();

authRouter.get('/me', auth, getCurrentUser);
authRouter.post('/login', loginLimiter, authenticateUser);
authRouter.post('/register', registerLimiter, createUser);

export { authRouter };