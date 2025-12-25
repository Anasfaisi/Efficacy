import { RequestHandler, Router } from 'express';
import { MentorController } from '@/controllers/mentor.controller';
import { asyncWrapper } from '@/utils/asyncWrapper';
import { MentorOnboardController } from '@/controllers/mentor-onboard.controller';
import { upload } from '@/utils/multerConfig';

export default function mentorRoutes(
    mentorController: MentorController,
    mentorOnboardController: MentorOnboardController
) {
    const router = Router();

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
        upload.fields([
            { name: 'resume', maxCount: 1 },
            { name: 'certificate', maxCount: 1 },
            { name: 'idProof', maxCount: 1 },
        ]),
        asyncWrapper(
            mentorOnboardController.mentorApplicationInit.bind(
                mentorOnboardController
            )
        )
    );

    // router.post(
    //     '/google-login',
    //     mentorController.googleAuth.bind(mentorController)
    // );

    return router;
}
