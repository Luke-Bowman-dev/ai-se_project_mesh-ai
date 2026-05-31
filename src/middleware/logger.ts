import type { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction): void => {
  console.info(new Date().toISOString(),
  req.method,
  req.path);
  next();
};