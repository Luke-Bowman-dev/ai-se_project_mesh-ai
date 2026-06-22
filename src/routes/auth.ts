import { Router } from 'express';
import { getCurrentUser, authenticateUser, createUser } from '../controllers/auth.js';
import { auth } from '../middleware/auth.js';

const authRouter = Router();

authRouter.get('/me', auth, getCurrentUser);
authRouter.post('/login', authenticateUser);
authRouter.post('/register', createUser);

export { authRouter };