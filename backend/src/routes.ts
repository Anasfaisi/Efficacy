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
}
