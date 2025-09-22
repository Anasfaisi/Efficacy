import express, { RequestHandler } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { TYPES } from '@/types/inversify-key.types';
import { container } from '@/config/inversify.config';
import { AdminAccessMiddleware } from '@/middleware/admin-auth.middleware';


export default function adminRoutes(adminController: AdminController) {
  const router = express.Router();
  const adminAccessMiddleware = container.get<AdminAccessMiddleware>(TYPES.AdminAccessMiddleware)

  router.post('/login',adminController.login.bind(adminController));
  
  router.post('/logout', adminController.logout.bind(adminController) as express.RequestHandler);
  
  router.post('/refresh-token',adminAccessMiddleware.handle, adminController.refreshTokenHandler.bind(adminController));
  return router;
}