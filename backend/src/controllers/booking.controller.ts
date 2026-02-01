import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "@/config/inversify-key.types";
import { IBookingService } from "@/serivces/Interfaces/IBooking.service";
import code from "@/types/http-status.enum";

@injectable()
export class BookingController {
    constructor(
        @inject(TYPES.BookingService)
        private _bookingService: IBookingService
    ) {}

    async createBooking(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(code.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }
        const booking = await this._bookingService.createBooking({ ...req.body, userId });
        res.status(code.CREATED).json(booking);
    }

    async getUserBookings(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(code.UNAUTHORIZED).json({ message: "User not authenticated" });
            return;
        }
        const bookings = await this._bookingService.getUserBookings(userId);
        res.status(code.OK).json(bookings);
    }

    async getMentorBookings(req: Request, res: Response): Promise<void> {
        const mentorId = req.currentUser?.id;
        if (!mentorId) {
            res.status(code.UNAUTHORIZED).json({ message: "Mentor not authenticated" });
            return;
        }
        const bookings = await this._bookingService.getMentorBookings(mentorId);
        res.status(code.OK).json(bookings);
    }

    async respondToReschedule(req: Request, res: Response): Promise<void> {
        const { bookingId, approve } = req.body;
        const updatedBooking = await this._bookingService.handleRescheduleResponse(bookingId, approve);
        res.status(code.OK).json(updatedBooking);
    }

    async requestReschedule(req: Request, res: Response): Promise<void> {
        const userId = req.currentUser?.id;
        const role = req.currentUser?.role;
        if (!userId) {
            res.status(code.UNAUTHORIZED).json({ message: "Not authenticated" });
            return;
        }

        const booking = await this._bookingService.requestReschedule({
            ...req.body,
            requestedBy: role === 'mentor' ? 'mentor' : 'user'
        });
        res.status(code.OK).json(booking);
    }

    async updateStatus(req: Request, res: Response): Promise<void> {
        const booking = await this._bookingService.updateBookingStatus(req.body);
        res.status(code.OK).json(booking);
    }
}
