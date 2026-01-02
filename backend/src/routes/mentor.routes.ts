import { RequestHandler, Router } from 'express';
import { MentorController } from '@/controllers/mentor.controller';
import { asyncWrapper } from '@/utils/asyncWrapper';
import { MentorOnboardController } from '@/controllers/mentor-onboard.controller';
import { upload } from '@/config/multer.config';

import { TokenService } from '@/serivces/token.service';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import { Role } from '@/types/role.types';

import { container } from '@/config/inversify.config';
import { TYPES } from '@/config/inversify-key.types';

import { validateRequest } from '@/middleware/validateRequest';
import { mentorApplicationSchema } from '@/validators/mentor.validator';

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

    // router.post(
    //     '/google-login',
    //     mentorController.googleAuth.bind(mentorController)
    // );

    return router;
}
