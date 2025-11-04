import { Router } from 'express';
import { RequestHandler } from 'express';
import { UserController } from '../controllers/auth.controller';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import { TokenService } from '@/serivces/token.service';
import { Role } from '@/types/role.types';

export default function authRoutes(userController: UserController) {
    const router = Router();
    const _tokenService = new TokenService();
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
        userController.googleAuth.bind(userController)
    );

    router.post(
        '/refresh',
        userController.refreshTokenHandler.bind(userController)
    );

    router.post(
        '/register/init',
        userController.registerInit.bind(userController)
    );
    router.post(
        '/register/verify',
        userController.registerVerify.bind(userController)
    );
    router.post(
        '/register/resend-otp',
        userController.resendOtp.bind(userController)
    );

    router.post(
        '/forgot-password/init',
        userController.forgotPassword.bind(userController)
    );
    router.post(
        '/forgot-password/verify',
        userController.resetPassword.bind(userController)
    );

    router.put(
        '/profile/update',
        authenticateAndAuthorize(_tokenService, Role.User),
        userController.updateUserProfile.bind(userController)
    );
    return router;
}
