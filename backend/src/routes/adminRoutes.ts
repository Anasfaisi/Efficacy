// import express from 'express';
// import { adminLogin, refreshAdminToken } from '../controllers/adminController.ts';
// import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.ts';

// const router = express.Router();

// router.post('/login', adminLogin);
// router.post('/refresh-token', adminAuthMiddleware, refreshAdminToken);
// router.post('/logout', adminAuthMiddleware, (req, res) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (refreshToken) {
//     globalThis.refreshTokens.delete(refreshToken);
//   }
//   res.clearCookie('refreshToken');
//   res.json({ message: 'Logged out' });
// });

// export default router;






import express from 'express';
import { AdminController } from '../controllers/adminController';
import { TYPES } from '@/types';
import { container } from '@/config/inversify.config';
import { AdminAccessMiddleware } from '@/middleware/adminAuthMiddleware';


export default function adminRoutes(adminController: AdminController) {
  const router = express.Router();
  const adminAccessMiddleware = container.get<AdminAccessMiddleware>(TYPES.AdminAccessMiddleware)

  router.post('/login',adminController.adminLogin.bind(adminController));
  
  router.post('/refresh-token',adminAccessMiddleware.handle, adminController.refreshAdminToken.bind(adminController));
  router.post('/logout', adminController.adminLogout.bind(adminController));

  return router;
}