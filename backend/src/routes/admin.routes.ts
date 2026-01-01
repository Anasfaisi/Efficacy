import express, { RequestHandler } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { TYPES } from '@/config/inversify-key.types';
import { container } from '@/config/inversify.config';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import { Role } from '@/types/role.types';
import { TokenService } from '@/serivces/token.service';
import { asyncWrapper } from '@/utils/asyncWrapper';

export default function adminRoutes(adminController: AdminController) {
    const router = express.Router();
    
    const tokenService = new TokenService();
    router.post(
        '/login',
       asyncWrapper(adminController.login.bind(adminController))
    );

    router.post(
        '/logout',
        adminController.logout.bind(adminController) as express.RequestHandler
    );

    router.post(
        '/refresh-token',
        adminController.refreshTokenHandler.bind(adminController)
    );

    router.get(
        '/notifications',
        authenticateAndAuthorize(tokenService, [Role.Admin]),
        asyncWrapper(adminController.getNotifications.bind(adminController))
    );

    // Mentor Applications
    router.get(
        '/mentors/applications',
        authenticateAndAuthorize(tokenService, [Role.Admin]),
        asyncWrapper(adminController.getMentorApplications.bind(adminController))
    );

    router.get(
        '/mentors/applications/:id',
        authenticateAndAuthorize(tokenService, [Role.Admin]),
        asyncWrapper(adminController.getMentorApplicationById.bind(adminController))
    );

    router.post(
        '/mentors/applications/:id/approve',
        authenticateAndAuthorize(tokenService, [Role.Admin]),
        asyncWrapper(adminController.approveMentorApplication.bind(adminController))
    );

    router.post(
        '/mentors/applications/:id/reject',
        authenticateAndAuthorize(tokenService, [Role.Admin]),
        asyncWrapper(adminController.rejectMentorApplication.bind(adminController))
    );

    router.post(
        '/mentors/applications/:id/request-changes',
        authenticateAndAuthorize(tokenService, [Role.Admin]),
        asyncWrapper(adminController.requestChangesMentorApplication.bind(adminController))
    );


    return router;
}


