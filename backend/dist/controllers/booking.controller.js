"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const inversify_1 = require("inversify");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const response_messages_types_1 = require("@/types/response-messages.types");
let BookingController = class BookingController {
    _bookingService;
    constructor(_bookingService) {
        this._bookingService = _bookingService;
    }
    async createBooking(req, res) {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(401 /* code.UNAUTHORIZED */).json({
                message: response_messages_types_1.CommonMessages.UserNotAuthenticated,
            });
            return;
        }
        const booking = await this._bookingService.createBooking({
            ...req.body,
            userId,
        });
        res.status(201 /* code.CREATED */).json(booking);
    }
    async getUserBookings(req, res) {
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(401 /* code.UNAUTHORIZED */).json({
                message: response_messages_types_1.CommonMessages.UserNotAuthenticated,
            });
            return;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const status = req.query.status;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const result = await this._bookingService.getUserBookings(userId, page, limit, status, startDate, endDate);
        res.status(200 /* code.OK */).json(result);
    }
    async getMentorBookings(req, res) {
        const mentorId = req.currentUser?.id;
        if (!mentorId) {
            res.status(401 /* code.UNAUTHORIZED */).json({
                message: response_messages_types_1.CommonMessages.MentorNotAuthenticated,
            });
            return;
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const status = req.query.status;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const result = await this._bookingService.getMentorBookings(mentorId, page, limit, status, startDate, endDate);
        res.status(200 /* code.OK */).json(result);
    }
    async getBookingById(req, res) {
        const { bookingId } = req.params;
        const booking = await this._bookingService.getBookingById(bookingId);
        if (!booking) {
            res.status(404 /* code.NOT_FOUND */).json({ message: 'Booking not found' });
            return;
        }
        res.status(200 /* code.OK */).json(booking);
    }
    async respondToReschedule(req, res) {
        const { bookingId, approve } = req.body;
        const updatedBooking = await this._bookingService.handleRescheduleResponse(bookingId, approve);
        res.status(200 /* code.OK */).json(updatedBooking);
    }
    async requestReschedule(req, res) {
        const userId = req.currentUser?.id;
        const role = req.currentUser?.role;
        if (!userId) {
            res.status(401 /* code.UNAUTHORIZED */).json({
                message: response_messages_types_1.CommonMessages.NotAuthenticated,
            });
            return;
        }
        const booking = await this._bookingService.requestReschedule({
            ...req.body,
            requestedBy: role === 'mentor' ? 'mentor' : 'user',
        });
        res.status(200 /* code.OK */).json(booking);
    }
    async updateStatus(req, res) {
        const booking = await this._bookingService.updateBookingStatus(req.body);
        res.status(200 /* code.OK */).json(booking);
    }
    async verifyAccess(req, res) {
        const { bookingId } = req.params;
        const userId = req.currentUser?.id;
        if (!userId) {
            res.status(401 /* code.UNAUTHORIZED */).json({
                message: response_messages_types_1.CommonMessages.NotAuthenticated,
            });
            return;
        }
        const hasAccess = await this._bookingService.verifyBookingAccess(bookingId, userId);
        if (hasAccess) {
            res.status(200 /* code.OK */).json({ success: true });
        }
        else {
            res.status(403 /* code.FORBIDDEN */).json({
                success: false,
                message: 'Access denied to this meeting',
            });
        }
    }
    async startSession(req, res) {
        const { bookingId } = req.params;
        const result = await this._bookingService.startSession(bookingId);
        res.status(200 /* code.OK */).json(result);
    }
    async endSession(req, res) {
        const { bookingId } = req.params;
        const result = await this._bookingService.endSession(bookingId);
        res.status(200 /* code.OK */).json(result);
    }
    async getMentorAvailability(req, res) {
        const { mentorId } = req.params;
        const availability = await this._bookingService.getMentorAvailability(mentorId);
        res.status(200 /* code.OK */).json(availability);
    }
};
exports.BookingController = BookingController;
exports.BookingController = BookingController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_key_types_1.TYPES.BookingService)),
    __metadata("design:paramtypes", [Object])
], BookingController);
//# sourceMappingURL=booking.controller.js.map