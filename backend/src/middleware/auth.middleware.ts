import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import code from "@/types/http-status.enum"

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(code.UNAUTHORIZED).json({ message: 'No token provided' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'access-secret-key') as { id: string; email: string; role: string };
    if (decoded.role !== 'user') {
      res.status(code.FORBIDDEN).json({ message: 'User access required' });
      return;
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(code.UNAUTHORIZED).json({ message: 'Invalid token' });
    return;
  }
};