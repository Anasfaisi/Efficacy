import { Router } from 'express';
import { MentorController } from '@/controllers/mentor.controller';
import { asyncWrapper } from '@/utils/asyncWrapper';
import { MentorOnboardController } from '@/controllers/mentor-onboard.controller';
import { upload } from '@/config/multer.config';

import { TokenService } from '@/serivces/token.service';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize.middleware';
import { Role } from '@/types/role.types';

import { container } from '@/config/inversify.config';
import { TYPES } from '@/config/inversify-key.types';

import { validateRequest } from '@/middleware/validate-request.middleware';
import {
    mentorApplicationSchema,
    updateMentorProfileSchema,
} from '@/validators/mentor.validator';

export default function mentorRoutes(
    mentorController: MentorController,
    mentorOnboardController: MentorOnboardController
) {
    const router = Router();
    const tokenService = container.get<TokenService>(TYPES.TokenService);

    router.post(
        '/login',
        asyncWrapper(mentorController.login.bind(mentorController))
    );
    router.post('/logout', mentorController.logout.bind(mentorController));

    router.post(
        '/register/init',
        asyncWrapper(mentorController.mentorRegisterInit.bind(mentorController))
    );
    router.post(
        '/resend-otp',
        asyncWrapper(mentorController.resendOtp.bind(mentorController))
    );
    router.post(
        '/forgot-password',
        asyncWrapper(mentorController.forgotPassword.bind(mentorController))
    );
    router.post(
        '/reset-password',
        asyncWrapper(mentorController.resetPassword.bind(mentorController))
    );
    router.post(
        '/google-login',
        asyncWrapper(mentorController.googleLogin.bind(mentorController))
    );

    router.post(
        '/register/verify',
        asyncWrapper(
            mentorController.menotrRegisterVerify.bind(mentorController)
        )
    );

    router.post(
        '/application/init',
        authenticateAndAuthorize(tokenService, [Role.Mentor]),
        upload.fields([
            { name: 'resume', maxCount: 1 },
            { name: 'certificate', maxCount: 1 },
            { name: 'idProof', maxCount: 1 },
        ]),
        validateRequest(mentorApplicationSchema),
        asyncWrapper(
            mentorOnboardController.mentorApplicationInit.bind(
                mentorOnboardController
            )
        )
    );
    router.post(
        '/activate',
        authenticateAndAuthorize(tokenService, [Role.Mentor]),
        asyncWrapper(
            mentorOnboardController.activateMentor.bind(mentorOnboardController)
        )
    );

    router.get(
        '/profile',
        authenticateAndAuthorize(tokenService, [Role.Mentor]),
        asyncWrapper(mentorController.getProfile.bind(mentorController))
    );

    router.patch(
        '/profile/basic-info',
        authenticateAndAuthorize(tokenService, [Role.Mentor]),
        validateRequest(updateMentorProfileSchema),
        asyncWrapper(
            mentorController.updateProfileBasicInfo.bind(mentorController)
        )
    );

    router.patch(
        '/profile/media',
        authenticateAndAuthorize(tokenService, [Role.Mentor]),
        upload.fields([
            { name: 'profilePic', maxCount: 1 },
            { name: 'coverPic', maxCount: 1 },
            { name: 'resume', maxCount: 1 },
            { name: 'certificate', maxCount: 1 },
            { name: 'idProof', maxCount: 1 },
        ]),
        validateRequest(updateMentorProfileSchema),
        asyncWrapper(mentorController.updateProfileMedia.bind(mentorController))
    );

    router.patch(
        '/profile/array-update',
        authenticateAndAuthorize(tokenService, [Role.Mentor]),
        validateRequest(updateMentorProfileSchema),
        asyncWrapper(mentorController.updateProfileArray.bind(mentorController))
    );
    router.get(
        '/list/approved',
        authenticateAndAuthorize(tokenService, [Role.User, Role.Mentor]),
        asyncWrapper(mentorController.getApprovedMentors.bind(mentorController))
    );

    router.get(
        '/notifications',
        authenticateAndAuthorize(tokenService, [Role.Mentor]),
        asyncWrapper(mentorController.getNotifications.bind(mentorController))
    );

    router.patch(
        '/notifications/:id/mark-read',
        authenticateAndAuthorize(tokenService, [Role.Mentor]),
        asyncWrapper(
            mentorController.markNotificationAsRead.bind(mentorController)
        )
    );

    router.patch(
        '/notifications/mark-all-read',
        authenticateAndAuthorize(tokenService, [Role.Mentor]),
        asyncWrapper(
            mentorController.markAllNotificationsAsRead.bind(mentorController)
        )
    );

    return router;
}
