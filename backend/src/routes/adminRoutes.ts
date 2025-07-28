import express from 'express';
import { adminLogin, refreshAdminToken } from '../controllers/adminController.ts';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.ts';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/refresh-token', adminAuthMiddleware, refreshAdminToken);
router.post('/logout', adminAuthMiddleware, (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    globalThis.refreshTokens.delete(refreshToken);
  }
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});

export default router;