import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IMentorshipService } from '@/serivces/Interfaces/IMentorship.service';
import code from '@/types/http-status.enum';

@injectable()
export class MentorshipController {
    constructor(
        @inject(TYPES.MentorshipService)
        private _mentorshipService: IMentorshipService
    ) {}

    async createRequest(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser!.id;
        const { mentorId, sessions, proposedStartDate } = req.body;
        const mentorship = await this._mentorshipService.createRequest(
            userId,
            mentorId,
            sessions,
            proposedStartDate
        );
        res.status(code.CREATED).json(mentorship);
    }

    async getMentorRequests(req: Request, res: Response): Promise<void> {
        const mentorId = req.currentUser!.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;
        const search = req.query.search as string;

        const requests = await this._mentorshipService.getMentorRequests(
            mentorId,
            page,
            limit,
            status,
            search
        );
        res.status(code.OK).json(requests);
    }

    async getUserRequests(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser!.id;
        const requests = await this._mentorshipService.getUserRequests(userId);
        res.status(code.OK).json(requests);
    }

    async respondToRequest(req: Request, res: Response): Promise<void> {
        const mentorId = req.currentUser!.id;
        const { id } = req.params;
        const { status, suggestedStartDate, reason } = req.body;
        const mentorship = await this._mentorshipService.respondToRequest(
            id,
            mentorId,
            status,
            suggestedStartDate,
            reason
        );
        res.status(code.OK).json(mentorship);
    }

    async confirmSuggestion(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser!.id;
        const { id } = req.params;
        const { confirm } = req.body;
        const mentorship =
            await this._mentorshipService.confirmMentorSuggestion(
                id,
                userId,
                confirm
            );
        res.status(code.OK).json(mentorship);
    }

    async verifyPayment(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { paymentId } = req.body;
        const mentorship = await this._mentorshipService.verifyPayment(
            id,
            paymentId
        );
        res.status(code.OK).json(mentorship);
    }

    async getActiveMentorship(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser!.id;
        const mentorship =
            await this._mentorshipService.getActiveMentorship(userId);
        res.status(code.OK).json(mentorship);
    }

    async getMentorshipById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const mentorship = await this._mentorshipService.getMentorshipById(id);
        res.status(code.OK).json(mentorship);
    }

    async bookSession(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser!.id;
        const { id } = req.params;
        const { date, slot } = req.body;
        const mentorship = await this._mentorshipService.bookSession(
            id,
            userId,
            date,
            slot
        );
        res.status(code.OK).json(mentorship);
    }

    async rescheduleSession(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { sessionId, newDate, newSlot } = req.body;
        const mentorship = await this._mentorshipService.rescheduleSession(
            id,
            sessionId,
            newDate,
            newSlot
        );
        res.status(code.OK).json(mentorship);
    }

    async completeMentorship(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { role } = req.body; // user or mentor
        const mentorship = await this._mentorshipService.completeMentorship(
            id,
            role
        );
        res.status(code.OK).json(mentorship);
    }

    async submitFeedback(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { role, rating, comment } = req.body;
        const mentorship = await this._mentorshipService.submitFeedback(
            id,
            role,
            rating,
            comment
        );
        res.status(code.OK).json(mentorship);
    }

    async cancelMentorship(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser!.id;
        const { id } = req.params;
    
        const mentorship = await this._mentorshipService.cancelMentorship(
            id,
            userId
        );
        res.status(code.OK).json(mentorship);
    }
}
