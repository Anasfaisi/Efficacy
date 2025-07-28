import { Request, Response } from 'express';
import adminRepository from '../repositories/adminRepository.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminAuthRequest } from '../middleware/adminAuthMiddleware.ts';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';

declare global {
  // eslint-disable-next-line no-var
  var refreshTokens: Set<string>;
}

globalThis.refreshTokens = globalThis.refreshTokens || new Set<string>();

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('reached in admin login', email, password);
    const admin = await adminRepository.findOne({ email });
    console.log(admin);
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      const hash = await bcrypt.hash(password, 10);
      console.log(hash, admin?.password);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const accessToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    globalThis.refreshTokens.add(refreshToken);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({ accessToken, user: { id: admin.id, email: admin.email, role: admin.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const refreshAdminToken = (req: AdminAuthRequest, res: Response) => {
  const user = req.user as { id: string; email: string; role: string };
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
  res.json({ accessToken, user: { id: user.id, email: user.email, role: user.role } });
};