import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Authorization token required' },
    });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({
        success: false,
        data: null,
        error: { message: 'Malformed authorization header' },
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    req.user = {
        userId: decoded.userId as string
    };
    next();
  } catch {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Invalid or expired token' },
    });
  }
};
