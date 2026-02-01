import { Router } from "express";
import { Container } from "inversify";
import { TYPES } from "@/config/inversify-key.types";
import { BookingController } from "@/controllers/booking.controller";
import authenticateAndAuthorize from "@/middleware/authenticateAndAuthorize";
import { TokenService } from "@/serivces/token.service";
import { Role } from "@/types/role.types";
import { asyncWrapper } from "@/utils/asyncWrapper";

export const bookingRoutes = (container: Container) => {
    const router = Router();
    const controller = container.get<BookingController>(TYPES.BookingController);
    const tokenService = container.get<TokenService>(TYPES.TokenService);

    const auth = (roles: Role | Role[]) => authenticateAndAuthorize(tokenService, roles);

    router.post("/", auth(Role.User), asyncWrapper(controller.createBooking.bind(controller)));
    router.get("/user", auth(Role.User), asyncWrapper(controller.getUserBookings.bind(controller)));
    router.get("/mentor", auth(Role.Mentor), asyncWrapper(controller.getMentorBookings.bind(controller)));
    router.patch("/status", auth([Role.Mentor, Role.User]), asyncWrapper(controller.updateStatus.bind(controller)));
    router.post("/reschedule-request", auth([Role.Mentor, Role.User]), asyncWrapper(controller.requestReschedule.bind(controller)));
    router.post("/reschedule-respond", auth([Role.Mentor, Role.User]), asyncWrapper(controller.respondToReschedule.bind(controller)));

    return router;
};
