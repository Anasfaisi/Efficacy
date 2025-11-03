import { UserRepository } from '@/repositories/user.repository';
import { AdminController } from '@/controllers/admin.controller';
import { AuthService } from '@/serivces/auth.service';
import { TYPES } from '@/types/inversify-key.types';
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

export const container = new Container();

container.bind<AdminController>(TYPES.AdminController).to(AdminController);
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<MentorController>(TYPES.MentorController).to(MentorController);
container
    .bind<PaymentController>(TYPES.PaymentController)
    .to(PaymentController);
container.bind<ChatController>(TYPES.ChatController).to(ChatController);
container.bind<SocketController>(TYPES.SocketController).to(SocketController);

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
