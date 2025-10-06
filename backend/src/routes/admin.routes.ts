import express, { RequestHandler } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { TYPES } from '@/types/inversify-key.types';
import { container } from '@/config/inversify.config';
import { AdminAccessMiddleware } from '@/middleware/admin-auth.middleware';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import { Role } from '@/types/role.types';
import { TokenService } from '@/serivces/token.service';

export default function adminRoutes(adminController: AdminController) {
    const router = express.Router();
    const adminAccessMiddleware = container.get<AdminAccessMiddleware>(
        TYPES.AdminAccessMiddleware
    );
    const tokenService = new TokenService();
    router.post(
        '/login',
        authenticateAndAuthorize(tokenService, Role.Admin),
        adminController.login.bind(adminController)
    );

    router.post(
        '/logout',
        adminController.logout.bind(adminController) as express.RequestHandler
    );

    router.post(
        '/refresh-token',
        adminAccessMiddleware.handle,
        adminController.refreshTokenHandler.bind(adminController)
    );
    return router;
}
