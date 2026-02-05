import { Router } from 'express';
import { RequestHandler } from 'express';
import { UserController } from '../controllers/user.controller';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import { TokenService } from '@/serivces/token.service';
import { Role } from '@/types/role.types';
import { upload } from '@/config/multer.config';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/config/inversify-key.types';
import { asyncWrapper } from '@/utils/asyncWrapper';

export default function authRoutes(userController: UserController) {
    const router = Router();
    const _tokenService = container.get<TokenService>(TYPES.TokenService);

    // router.get(
    //     '/me/:id',
    //     authenticateAndAuthorize(tokenService, Role.User),
    //     userController.getCurrentUser.bind(userController) as RequestHandler
    // );

    router.post('/login', userController.login.bind(userController));

    router.post(
        '/logout',
        userController.logout.bind(userController) as RequestHandler
    );

    router.post(
        '/google-login',
        asyncWrapper(userController.googleAuth.bind(userController))
    );

    router.post(
        '/refresh',
        userController.refreshTokenHandler.bind(userController)
    );

    router.post(
        '/register/init',
        asyncWrapper(userController.registerInit.bind(userController))
    );
    router.post(
        '/register/verify',
        asyncWrapper(userController.registerVerify.bind(userController))
    );
    router.post(
        '/register/resend-otp',
        asyncWrapper(userController.resendOtp.bind(userController))
    );

    router.post(
        '/forgot-password/init',
        asyncWrapper(userController.forgotPassword.bind(userController))
    );
    router.post(
        '/forgot-password/verify',
        asyncWrapper(userController.resetPassword.bind(userController))
    );

    router.patch(
        '/profile/:id',
        authenticateAndAuthorize(_tokenService, Role.User),
        userController.updateUserProfile.bind(userController)
    );
    router.patch(
        '/profile/picture/:id',
        authenticateAndAuthorize(_tokenService, Role.User),
        upload.single('image'),
        userController.updateProfilePic.bind(userController)
    );

    router.get(
        '/notifications',
        authenticateAndAuthorize(_tokenService, Role.User),
        asyncWrapper(userController.getNotifications.bind(userController))
    );

    router.patch(
        '/notifications/:id/mark-read',
        authenticateAndAuthorize(_tokenService, Role.User),
        asyncWrapper(userController.markNotificationAsRead.bind(userController))
    );

    router.patch(
        '/notifications/mark-all-read',
        authenticateAndAuthorize(_tokenService, Role.User),
        asyncWrapper(
            userController.markAllNotificationsAsRead.bind(userController)
        )
    );

    return router;
}
