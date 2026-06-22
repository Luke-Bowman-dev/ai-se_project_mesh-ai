import type { Request, Response } from 'express';

import Chat from '../models/chat.js';
import Message from '../models/message.js';

export const getChats = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;

  const chats = await Chat.find({ userId });

  res.status(200).json({
    success: true,
    data: {chats},
    error: null
  });
};

export const createChat = async (req: Request, res: Response): Promise<void> => {
  const {title, createdAt} = req.body;
  
  const userId = req.user!.userId;
  
  if (!title) {
    res.status(400).json({
      success: false,
      data: {},
      error: {message: 'Must include Title and/or User ID'}
    });
  }
  const chat = await Chat.create({title, userId, createdAt});

  res.status(201).json({
    success: true,
    data: {chat},
    error: null
  });
};

export const getChatById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;

  const chat = await Chat.findOne({ _id: req.params.id, userId });

  if (!chat) {
    res.status(404).json({
      success: false,
      data: {},
      error: {message: 'Chat not found'}
    });
    return;
  }

  const messages = await Message.find({chatId: chat._id}).sort({ createdAt: 1});

  res.status(200).json({
    success: true,
    data: {chat, messages},
    error: null
  });
};

export const deleteChat = (req: Request, res: Response): void => {
  res.status(204).json({
    success: true,
    data: {},
    error: null
  });
};

export const sendMessage = (req: Request, res: Response): void => {
  res.status(201).json({
    success: true,
    data: {},
    error: null
  });
};

export const patchMessage = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: {},
    error: null
  });
};