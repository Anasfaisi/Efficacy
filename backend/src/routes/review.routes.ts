import { Router } from 'express';
import { ReviewController } from '@/controllers/review.controller';
import { asyncWrapper } from '@/utils/asyncWrapper';
import { container } from '@/config/inversify.config';
import { TYPES } from '@/config/inversify-key.types';
import { TokenService } from '@/serivces/token.service';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import { Role } from '@/types/role.types';

export default function reviewRoutes(reviewController: ReviewController) {
    const router = Router();
    const tokenService = container.get<TokenService>(TYPES.TokenService);

    router.post(
        '/',
        authenticateAndAuthorize(tokenService, [Role.User]),
        asyncWrapper(reviewController.submitReview.bind(reviewController))
    );

    router.get(
        '/mentor/:mentorId',
        asyncWrapper(reviewController.getMentorReviews.bind(reviewController))
    );

    return router;
}
