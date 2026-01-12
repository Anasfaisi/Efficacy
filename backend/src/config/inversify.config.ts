import { UserRepository } from '@/repositories/user.repository';
import { AdminController } from '@/controllers/admin.controller';
import { AuthService } from '@/serivces/auth.service';
import { TYPES } from '@/config/inversify-key.types';
import { Container } from 'inversify';
import { AdminRepository } from '@/repositories/admin.repository';
import { TokenService } from '@/serivces/token.service';
import { ValidationService } from '@/serivces/validation.service';
import { UserController } from '@/controllers/auth.controller';
import { MentorRepository } from '@/repositories/mentor.repository';
import { MentorController } from '@/controllers/mentor.controller';
import { GoogleVerificationService } from '@/serivces/google-verification.service';
import { UnverifiedUserRepository } from '@/repositories/unverified-user.repository';
import { OtpService } from '@/serivces/otp.service';
import { PaymentService } from '@/serivces/payment.service';
import { PaymentController } from '@/controllers/payment.controller';
import { ChatController } from '@/controllers/chat.controller';
import { SocketService } from '@/serivces/socket.service';
import { SocketController } from '@/controllers/socket.controller';
import { IPaymentService } from '@/serivces/Interfaces/IPayment.service';
import { IAdminRepository } from '@/repositories/interfaces/IAdmin.repository';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { IUnverifiedUserRepository } from '@/repositories/interfaces/IUnverified-user.repository';
import { IUserRepository } from '@/repositories/interfaces/IUser.repository';
import { ISocketService } from '@/serivces/Interfaces/ISocket.service';
import { IAdmin } from '@/models/Admin.model';
import { IMessageRepository } from '@/repositories/interfaces/IMessage.repository';
import { MessageRepository } from '@/repositories/message.repository';
import { ChatService } from '@/serivces/chat.service';
import { IChatService } from '@/serivces/Interfaces/IChat.service';
import { ChatRepository } from '@/repositories/chat.repository';
import { IChatRepository } from '@/repositories/interfaces/IChat.repository';
import { KanbanController } from '@/controllers/Kanban.controller';
import { IKanbanService } from '@/serivces/Interfaces/Ikanban.service';
import { KanbanService } from '@/serivces/kanban.service';
import { IKanbanRepository } from '@/repositories/interfaces/IKanban.repository';
import { KanbanRepository } from '@/repositories/Kanban.repository';
import { AdminAuthService } from '@/serivces/admin-auth.service';
import { IAdminAuthService } from '@/serivces/Interfaces/IAdmin-authService';
import { MentorOnboardController } from '@/controllers/mentor-onboard.controller';
import { IMentorOnboardService } from '@/serivces/Interfaces/IMentor-onboard.service';
import { MentorOnboardService } from '@/serivces/mentor-onboard.service';
import { INotificationRepository } from '@/repositories/interfaces/INotification.repository';
import { NotificationRepository } from '@/repositories/Notification.repository';
import { INotificationService } from '@/serivces/Interfaces/INotification.service';
import { NotificationService } from '@/serivces/notification.service';
import { IAdminService } from '@/serivces/Interfaces/IAdmin.service';
import { AdminService } from '@/serivces/admin.service';
import { IPasswordService } from '@/serivces/Interfaces/IPassword.service';
import { PasswordService } from '@/serivces/password.service';
import { IMentorAuthService } from '@/serivces/Interfaces/IMentor-auth.service';
import { MentorAuthService } from '@/serivces/mentor-auth.service';
import { IMentorService } from '@/serivces/Interfaces/IMentor.service';
import { MentorService } from '@/serivces/mentor.service';


export const container = new Container();

container.bind<AdminController>(TYPES.AdminController).to(AdminController);
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<MentorController>(TYPES.MentorController).to(MentorController);
container
    .bind<PaymentController>(TYPES.PaymentController)
    .to(PaymentController);
container.bind<ChatController>(TYPES.ChatController).to(ChatController);
container.bind<SocketController>(TYPES.SocketController).to(SocketController);
container.bind<KanbanController>(TYPES.KanbanController).to(KanbanController);
container
    .bind<MentorOnboardController>(TYPES.MentorOnboardController)
    .to(MentorOnboardController);

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<TokenService>(TYPES.TokenService).to(TokenService);
container.bind<OtpService>(TYPES.OtpService).to(OtpService);
container
    .bind<ValidationService>(TYPES.ValidationService)
    .to(ValidationService);
container
    .bind<GoogleVerificationService>(TYPES.GoogleVerificationService)
    .to(GoogleVerificationService);
container.bind<IPaymentService>(TYPES.PaymentService).to(PaymentService);
container.bind<IChatService>(TYPES.ChatService).to(ChatService);
container.bind<ISocketService>(TYPES.SocketService).to(SocketService);
container.bind<IKanbanService>(TYPES.KanbanService).to(KanbanService);
container.bind<IAdminAuthService>(TYPES.AdminAuthService).to(AdminAuthService);
container
    .bind<IMentorOnboardService>(TYPES.MentorOnboardService)
    .to(MentorOnboardService);
container
    .bind<INotificationService>(TYPES.NotificationService)
    .to(NotificationService);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService);
container.bind<IPasswordService>(TYPES.PasswordService).to(PasswordService);
container.bind<IMentorAuthService>(TYPES.MentorAuthService).to(MentorAuthService);
container.bind<IMentorService>(TYPES.MentorService).to(MentorService);


container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container
    .bind<IAdminRepository<IAdmin>>(TYPES.AdminRepository)
    .to(AdminRepository);
container.bind<IMentorRepository>(TYPES.MentorRepository).to(MentorRepository);
container
    .bind<IUnverifiedUserRepository>(TYPES.UnverifiedUserRepository)
    .to(UnverifiedUserRepository);
container.bind<IChatRepository>(TYPES.ChatRepository).to(ChatRepository);
container
    .bind<IMessageRepository>(TYPES.MessageRepository)
    .to(MessageRepository);
container.bind<IKanbanRepository>(TYPES.KanbanRepository).to(KanbanRepository);
container
    .bind<INotificationRepository>(TYPES.NotificationRepository)
    .to(NotificationRepository);
