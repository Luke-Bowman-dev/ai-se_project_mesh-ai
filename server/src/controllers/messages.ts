import type { Request, Response } from "express";
import { getClient, LLM_MODEL, buildContext } from "../utils/openai-client.js";
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';
import Chat from '../models/chat.js';
import Message from '../models/message.js';

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  const { question } = req.body;
  const chatId = req.params.id;
  const userId = req.user!.userId;

  if (!question) {
     res.status(400).json({
       success: false,
       data: null,
       error: { message: 'question is required' },
     });
     return;
   }

  const chat = await Chat.findOne({ _id: chatId, userId });

  if (!chat) {
    res.status(404).json({
        success: false,
        data: null,
        error: { message: 'Chat not Found'}
    });
    return;
   }
  

  // RAG pipeline — same as queryDocuments
  const userDocs = await Document.find({ userId }, '_id');
  const docIds = userDocs.map((d) => d._id);
  const chunkRecords = await Chunk.find({ documentId: { $in: docIds } });
  const chunks = chunkRecords.map((c) => ({
    id: String(c._id),
    documentId: String(c.documentId),
    text: c.text,
    embedding: c.embedding,
  }));
  const queryEmbedding = await createEmbedding(question);
  const ranked = rankBySimilarity(queryEmbedding, chunks, 5);
  const context = buildContext(ranked);

  const response = await getClient().chat.completions.create({
      model: LLM_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful research assistant. Answer the question using only the provided context. If the context does not contain enough information to answer, say so.',
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion:\n${question}`,
        },
      ],
      temperature: 0.2,
    });
  
    const answer = response.choices[0]!.message.content ?? 'No answer returned.';

    // Save the user question and the assistant answer as Message documents
    const userMessage = await Message.create({
      chatId: chat._id,
      role: 'user',
      content: question,
    });

    const assistantMessage = await Message.create({
      chatId: chat._id,
      role: 'assistant',
      content: answer,
    });

    res.status(201).json({
      success: true,
      data: { messages: [userMessage, assistantMessage], chunks: ranked },
      error: null,
    });
};