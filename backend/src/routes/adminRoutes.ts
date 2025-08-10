import express, { RequestHandler } from 'express';
import { AdminController } from '../controllers/adminController';
import { TYPES } from '@/types';
import { container } from '@/config/inversify.config';
import { AdminAccessMiddleware } from '@/middleware/adminAuthMiddleware';


export default function adminRoutes(adminController: AdminController) {
  const router = express.Router();
  const adminAccessMiddleware = container.get<AdminAccessMiddleware>(TYPES.AdminAccessMiddleware)

  router.post('/login',adminController.adminLogin.bind(adminController));
  
  router.post('/refresh-token',adminAccessMiddleware.handle, adminController.refreshAdminToken.bind(adminController));
  router.post('/logout', adminController.adminLogout.bind(adminController) as express.RequestHandler);

  return router;
}