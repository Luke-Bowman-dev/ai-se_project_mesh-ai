import { Router } from 'express';
import { getCurrentUser, authenticateUser, createUser } from '../controllers/auth.js';

const authRouter = Router();

authRouter.get('/me', getCurrentUser);
authRouter.post('/login', authenticateUser);
authRouter.post('/register', createUser);

export { authRouter };