import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Request to include user property
export interface AdminAuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';

export const adminAuthMiddleware = (req: AdminAuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  const refreshToken = req.cookies.refreshToken;

  // Handle refresh-token route
  if (req.path.includes('/refresh-token')) {
    if (!refreshToken || !globalThis.refreshTokens.has(refreshToken)) {
      res.status(401).json({ message: 'Invalid or expired refresh token' });
      return;
    }
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: string; email: string; role: string };
      if (decoded.role !== 'admin') {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }
    return;
  }

  // Handle other protected routes
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { id: string; email: string; role: string };
    if (decoded.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token expired' });
    return;
  }
};