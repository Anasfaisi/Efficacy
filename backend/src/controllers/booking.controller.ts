import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IBookingService } from '@/serivces/Interfaces/IBooking.service';
import code from '@/types/http-status.enum';
import { CommonMessages } from '@/types/response-messages.types';

@injectable()
export class BookingController {
    constructor(
        @inject(TYPES.BookingService)
        private _bookingService: IBookingService
    ) {}

    async createBooking(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(code.UNAUTHORIZED).json({
                message: CommonMessages.UserNotAuthenticated,
            });
            return;
        }
        const booking = await this._bookingService.createBooking({
            ...req.body,
            userId,
        });
        res.status(code.CREATED).json(booking);
    }

    async getUserBookings(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(code.UNAUTHORIZED).json({
                message: CommonMessages.UserNotAuthenticated,
            });
            return;
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const status = req.query.status as string;
        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;

        const result = await this._bookingService.getUserBookings(
            userId,
            page,
            limit,
            status,
            startDate,
            endDate
        );
        res.status(code.OK).json(result);
    }
    async getMentorBookings(req: Request, res: Response): Promise<void> {
        const mentorId = req.currentUser?.id;
        if (!mentorId) {
            res.status(code.UNAUTHORIZED).json({
                message: CommonMessages.MentorNotAuthenticated,
            });
            return;
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const status = req.query.status as string;
        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;

        const result = await this._bookingService.getMentorBookings(
            mentorId,
            page,
            limit,
            status,
            startDate,
            endDate
        );
        res.status(code.OK).json(result);
    }

    async getBookingById(req: Request, res: Response): Promise<void> {
        const { bookingId } = req.params;
        const booking = await this._bookingService.getBookingById(bookingId);
        if (!booking) {
            res.status(code.NOT_FOUND).json({ message: 'Booking not found' });
            return;
        }
        res.status(code.OK).json(booking);
    }


    async respondToReschedule(req: Request, res: Response): Promise<void> {
        const { bookingId, approve } = req.body;
        const updatedBooking =
            await this._bookingService.handleRescheduleResponse(
                bookingId,
                approve
            );
        res.status(code.OK).json(updatedBooking);
    }

    async requestReschedule(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;
        const role = req.currentUser?.role;
        if (!userId) {
            res.status(code.UNAUTHORIZED).json({
                message: CommonMessages.NotAuthenticated,
            });
            return;
        }

        const booking = await this._bookingService.requestReschedule({
            ...req.body,
            requestedBy: role === 'mentor' ? 'mentor' : 'user',
        });
        res.status(code.OK).json(booking);
    }

    async updateStatus(req: Request, res: Response): Promise<void> {
        const booking = await this._bookingService.updateBookingStatus(
            req.body
        );
        res.status(code.OK).json(booking);
    }

    async verifyAccess(req: Request, res: Response): Promise<void> {
        const { bookingId } = req.params;
        const userId = req.currentUser?.id;

        if (!userId) {
            res.status(code.UNAUTHORIZED).json({
                message: CommonMessages.NotAuthenticated,
            });
            return;
        }

        const hasAccess = await this._bookingService.verifyBookingAccess(
            bookingId,
            userId
        );

        if (hasAccess) {
            res.status(code.OK).json({ success: true });
        } else {
            res.status(code.FORBIDDEN).json({
                success: false,
                message: 'Access denied to this meeting',
            });
        }
    }

    async startSession(req: Request, res: Response): Promise<void> {
        const { bookingId } = req.params;
        const result = await this._bookingService.startSession(bookingId);
        res.status(code.OK).json(result);
    }

    async endSession(req: Request, res: Response): Promise<void> {
        const { bookingId } = req.params;
        const result = await this._bookingService.endSession(bookingId);
        res.status(code.OK).json(result);
    }
}
