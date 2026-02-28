import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IReviewService } from '@/serivces/Interfaces/IReview.service';
import code from '@/types/http-status.enum';

@injectable()
export class ReviewController {
    constructor(
        @inject(TYPES.ReviewService) private _reviewService: IReviewService
    ) {}

    async submitReview(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;

        const result = await this._reviewService.submitReview({
            ...req.body,
            userId: userId || req.body.userId,
        });

        res.status(code.CREATED).json({
            success: true,
            message: 'Review submitted successfully',
            data: result,
        });
    }

    async getMentorReviews(req: Request, res: Response): Promise<void> {
        const { mentorId } = req.params;
        const result = await this._reviewService.getMentorReviews(mentorId);

        res.status(code.OK).json({
            success: true,
            data: result,
        });
    }
}
