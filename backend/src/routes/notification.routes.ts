
import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import { TokenService } from '@/serivces/token.service';
import { Role } from '@/types/role.types';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/config/inversify-key.types';
import { asyncWrapper } from '@/utils/asyncWrapper';

export default function notificationRoutes(
    notificationController: NotificationController
) {
    const router = Router();
    const _tokenService = container.get<TokenService>(TYPES.TokenService);
    const allowedRoles = [Role.User, Role.Mentor, Role.Admin];

    router.get(
        '/',
        authenticateAndAuthorize(_tokenService, allowedRoles),
        asyncWrapper(notificationController.getNotifications.bind(notificationController))
    );

    router.patch(
        '/:id/read',
        authenticateAndAuthorize(_tokenService, allowedRoles),
        asyncWrapper(notificationController.markAsRead.bind(notificationController))
    );

    router.patch(
        '/read-all',
        authenticateAndAuthorize(_tokenService, allowedRoles),
        asyncWrapper(notificationController.markAllAsRead.bind(notificationController))
    );

    return router;
}
