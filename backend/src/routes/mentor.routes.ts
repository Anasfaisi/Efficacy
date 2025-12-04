import { RequestHandler, Router } from 'express';
import { MentorController } from '@/controllers/mentor.controller';
import { asyncWrapper } from '@/utils/asyncWrapper';

export default function mentorRoutes(mentorController: MentorController) {
    const router = Router();

    router.post('/login', asyncWrapper(mentorController.login.bind(mentorController)));
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
        '/google-login',
        mentorController.googleAuth.bind(mentorController)
    );

    return router;
}
