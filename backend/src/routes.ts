import bodyParser from 'body-parser';
import { Express } from 'express';
import { container } from './config/inversify.config';
import { AdminController } from './controllers/admin.controller';
import { UserController } from './controllers/auth.controller';
import { ChatController } from './controllers/chat.controller';
import { MentorController } from './controllers/mentor.controller';
import { PaymentController } from './controllers/payment.controller';
import adminRoutes from './routes/admin.routes';
import chatRoutes from './routes/chat.routes';
import mentorRoutes from './routes/mentor.routes';
import paymentRoutes from './routes/payment.routes';
import userRoutes from './routes/user.routes';
import { TYPES } from './config/inversify-key.types';
import { KanbanController } from './controllers/Kanban.controller';
import KanbanRoutes from './routes/Kanban.routes';

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
    const kanbanController = container.get<KanbanController>(
        TYPES.KanbanController
    );

    app.use('/api', userRoutes(userController));
    app.use('/api/admin', adminRoutes(adminController));
    app.use('/api/mentor', mentorRoutes(mentorController));
    app.use('/api/payments', paymentRoutes(paymentController));
    app.use('/api/chat', chatRoutes(chatController));
    app.use('/api/kanban', KanbanRoutes(kanbanController));
}
