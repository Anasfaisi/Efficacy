import { Express } from 'express';
import { container } from './config/inversify.config';
import { AdminController } from './controllers/admin.controller';
import { UserController } from './controllers/user.controller';
import { ChatController } from './controllers/chat.controller';
import { MentorController } from './controllers/mentor.controller';
import { PaymentController } from './controllers/payment.controller';
import adminRoutes from './routes/admin.routes';
import chatRoutes from './routes/chat.routes';
import mentorRoutes from './routes/mentor.routes';
import paymentRoutes from './routes/payment.routes';
import userRoutes from './routes/user.routes';
import { TYPES } from './config/inversify-key.types';
import PlannerTaskRoutes from './routes/planner-task.routes';
import { MentorOnboardController } from './controllers/mentor-onboard.controller';
import { PlannerTaskController } from './controllers/planner-task.controller';
import { MentorshipController } from './controllers/mentorship.controller';
import mentorshipRoutes from './routes/mentorship.routes';
import pomodoroRouter from './routes/pomodoro.routes';
import { PomodoroController } from './controllers/pomodoro.controller';
import { NoteController } from './controllers/note.controller';
import noteRoutes from './routes/note.routes';
import { bookingRoutes } from './routes/booking.routes';
import { ReviewController } from './controllers/review.controller';
import reviewRoutes from './routes/review.routes';
import { GamificationController } from './controllers/Gamification/gamification.controller';
import gamificationRoutes from './routes/gamification.routes';
import { PlanController } from './controllers/plan.controller';
import planRoutes from './routes/plan.routes';
import { BadgeController } from './controllers/Gamification/badge.controller';
import { ITokenService } from './serivces/Interfaces/IToken.service';
import BadgeRoutes from './routes/Gamification/badge.routes';

export function applyRoutes(app: Express) {
    const adminController = container.get<AdminController>(
        TYPES.AdminController
    );
    const mentorController = container.get<MentorController>(
        TYPES.MentorController
    );
    const userController = container.get<UserController>(TYPES.UserController);

    const chatController = container.get<ChatController>(TYPES.ChatController);
    const paymentController = container.get<PaymentController>(
        TYPES.PaymentController
    );

    const mentorOnboardController = container.get<MentorOnboardController>(
        TYPES.MentorOnboardController
    );
    const plannerTaskController = container.get<PlannerTaskController>(
        TYPES.PlannerTaskController
    );
    const mentorshipController = container.get<MentorshipController>(
        TYPES.MentorshipController
    );
    const pomodoroController = container.get<PomodoroController>(
        TYPES.PomodoroController
    );
    const noteController = container.get<NoteController>(TYPES.NoteController);
    const reviewController = container.get<ReviewController>(
        TYPES.ReviewController
    );
    const gamificationController = container.get<GamificationController>(
        TYPES.GamificationController
    );
    const planController = container.get<PlanController>(TYPES.PlanController);
    const badgeController = container.get<BadgeController>(
        TYPES.BadgeController
    );
    const tokenService = container.get<ITokenService>(TYPES.TokenService);
    app.use('/api', userRoutes(userController));
    app.use('/api/admin', adminRoutes(adminController));
    app.use(
        '/api/mentor',
        mentorRoutes(mentorController, mentorOnboardController)
    );
    app.use('/api/payments', paymentRoutes(paymentController));
    app.use('/api/chat', chatRoutes(chatController));
    app.use('/api/planner', PlannerTaskRoutes(plannerTaskController));
    app.use('/api/mentorship', mentorshipRoutes(mentorshipController));
    app.use('/api/pomodoro', pomodoroRouter(pomodoroController));
    app.use('/api/notes', noteRoutes(noteController));
    app.use('/api/booking', bookingRoutes(container));
    app.use('/api/reviews', reviewRoutes(reviewController));
    app.use('/api/badge', BadgeRoutes(badgeController, tokenService));
    app.use('/api/plan', planRoutes(planController));
    app.use(
        '/api/gamification',
        gamificationRoutes(gamificationController, tokenService)
    );
}
