import { Router } from 'express';
import { RequestHandler } from 'express';
import { UserController } from '../controllers/auth.controller';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import { TokenService } from '@/serivces/token.service';
import { Role } from '@/types/role.types';
import { upload } from '@/config/multer.config';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/config/inversify-key.types';

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

    router.post(
        '/update/profile/:id',
        authenticateAndAuthorize(_tokenService, Role.User),
        userController.updateUserProfile.bind(userController) 
    );
    router.post(
        '/profile/proPicUpdate/:id',
        authenticateAndAuthorize(_tokenService, Role.User),
        upload.single('image'),
        userController.updateProfilePic.bind(userController)
    );
    return router;
}
