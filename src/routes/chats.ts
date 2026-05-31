import { Router } from 'express';
import { getChats, createChat, getChatById, deleteChat, sendMessage, patchMessage} from '../controllers/chats.js';

const chatsRouter = Router();

chatsRouter.get('/', getChats);
chatsRouter.post('/', createChat);
chatsRouter.get('/:id', getChatById);
chatsRouter.delete('/:id', deleteChat);
chatsRouter.post('/:id/messages', sendMessage);
chatsRouter.patch('/:id', patchMessage);

export {chatsRouter};