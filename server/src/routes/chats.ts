import { Router } from 'express';
import { getChats, createChat, getChatById, deleteChat} from '../controllers/chats.js';
import { auth } from '../middleware/auth.js';
import { createMessage } from '../controllers/messages.js';

const chatsRouter = Router();

chatsRouter.use(auth);

chatsRouter.get('/', getChats);
chatsRouter.post('/', createChat);
chatsRouter.get('/:id', getChatById);
chatsRouter.delete('/:id', deleteChat);
chatsRouter.post('/:id/messages', createMessage);

export {chatsRouter};