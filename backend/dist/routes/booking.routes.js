"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = require("express");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const authenticate_and_authorize_1 = __importDefault(require("@/middleware/authenticate-and-authorize"));
const role_types_1 = require("@/types/role.types");
const asyncWrapper_1 = require("@/utils/asyncWrapper");
const validate_request_1 = require("@/middleware/validate-request");
const booking_validator_1 = require("@/validators/booking.validator");
const bookingRoutes = (container) => {
    const router = (0, express_1.Router)();
    const controller = container.get(inversify_key_types_1.TYPES.BookingController);
    const tokenService = container.get(inversify_key_types_1.TYPES.TokenService);
    const auth = (roles) => (0, authenticate_and_authorize_1.default)(tokenService, roles);
    router.post('/', auth(role_types_1.Role.User), (0, validate_request_1.validateRequest)(booking_validator_1.createBookingSchema), (0, asyncWrapper_1.asyncWrapper)(controller.createBooking.bind(controller)));
    router.get('/user', auth(role_types_1.Role.User), (0, asyncWrapper_1.asyncWrapper)(controller.getUserBookings.bind(controller)));
    router.get('/mentor', auth(role_types_1.Role.Mentor), (0, asyncWrapper_1.asyncWrapper)(controller.getMentorBookings.bind(controller)));
    router.patch('/status', auth([role_types_1.Role.Mentor, role_types_1.Role.User]), (0, asyncWrapper_1.asyncWrapper)(controller.updateStatus.bind(controller)));
    router.post('/reschedule-request', auth([role_types_1.Role.Mentor, role_types_1.Role.User]), (0, validate_request_1.validateRequest)(booking_validator_1.rescheduleRequestSchema), (0, asyncWrapper_1.asyncWrapper)(controller.requestReschedule.bind(controller)));
    router.post('/reschedule-respond', auth([role_types_1.Role.Mentor, role_types_1.Role.User]), (0, asyncWrapper_1.asyncWrapper)(controller.respondToReschedule.bind(controller)));
    router.get('/verify/:bookingId', auth([role_types_1.Role.Mentor, role_types_1.Role.User]), (0, asyncWrapper_1.asyncWrapper)(controller.verifyAccess.bind(controller)));
    router.post('/start-session/:bookingId', auth([role_types_1.Role.Mentor, role_types_1.Role.User]), (0, asyncWrapper_1.asyncWrapper)(controller.startSession.bind(controller)));
    router.post('/end-session/:bookingId', auth([role_types_1.Role.Mentor, role_types_1.Role.User]), (0, asyncWrapper_1.asyncWrapper)(controller.endSession.bind(controller)));
    router.get('/:bookingId', auth([role_types_1.Role.Mentor, role_types_1.Role.User]), (0, asyncWrapper_1.asyncWrapper)(controller.getBookingById.bind(controller)));
    router.get('/mentor/:mentorId/availability', auth([role_types_1.Role.User, role_types_1.Role.Mentor]), (0, asyncWrapper_1.asyncWrapper)(controller.getMentorAvailability.bind(controller)));
    return router;
};
exports.bookingRoutes = bookingRoutes;
//# sourceMappingURL=booking.routes.js.map