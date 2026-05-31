import type { Request, Response } from 'express';

export const uploadDocument = (req: Request, res: Response): void => {
  res.status(201).json({
    success: true,
    data: {},
    error: null
  });
};

export const uploadDocumentIngest = (req: Request, res: Response): void => {
  res.status(201).json({
    success: true,
    data: {},
    error: null
  });
};

export const listDocuments = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: {},
    error: null
  });
};

export const fetchDocument = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: {},
    error: null
  });
};

export const deleteDocument = (req: Request, res: Response): void => {
  res.status(204).json({
    success: true,
    data: {},
    error: null
  });
};

export const patchDocument = (req: Request, res: Response): void => {
  res.status(201).json({
    success: true,
    data: {},
    error: null
  });
};