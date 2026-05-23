import { UserRepository } from '@/repositories/user.repository';
import { AdminController } from '@/controllers/admin.controller';
import { AuthService } from '@/services/auth.service';
import { TYPES } from '@/config/inversify-key.types';
import { Container } from 'inversify';
import { AdminRepository } from '@/repositories/admin.repository';
import { TokenService } from '@/services/token.service';
import { ValidationService } from '@/services/validation.service';
import { UserController } from '@/controllers/user.controller';
import { MentorRepository } from '@/repositories/mentor.repository';
import { MentorController } from '@/controllers/mentor.controller';
import { GoogleVerificationService } from '@/services/google-verification.service';
import { UnverifiedUserRepository } from '@/repositories/unverified-user.repository';
import { OtpService } from '@/services/otp.service';
import { PaymentService } from '@/services/payment.service';
import { PaymentController } from '@/controllers/payment.controller';
import { ChatController } from '@/controllers/chat.controller';
import { SocketService } from '@/services/socket.service';
import { SocketController } from '@/controllers/socket.controller';
import { IPaymentService } from '@/services/Interfaces/IPayment.service';
import { IAdminRepository } from '@/repositories/interfaces/IAdmin.repository';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { IUnverifiedUserRepository } from '@/repositories/interfaces/IUnverified-user.repository';
import { IUserRepository } from '@/repositories/interfaces/IUser.repository';
import { ISocketService } from '@/services/Interfaces/ISocket.service';
import { IAdmin } from '@/models/admin.model';
import { IMessageRepository } from '@/repositories/interfaces/IMessage.repository';
import { MessageRepository } from '@/repositories/message.repository';
import { ChatService } from '@/services/chat.service';
import { IChatService } from '@/services/Interfaces/IChat.service';
import { ChatRepository } from '@/repositories/chat.repository';
import { IChatRepository } from '@/repositories/interfaces/IChat.repository';
import { AdminAuthService } from '@/services/admin-auth.service';
import { IAdminAuthService } from '@/services/Interfaces/IAdmin-authService';
import { MentorOnboardController } from '@/controllers/mentor-onboard.controller';
import { IMentorOnboardService } from '@/services/Interfaces/IMentor-onboard.service';
import { MentorOnboardService } from '@/services/mentor-onboard.service';
import { INotificationRepository } from '@/repositories/interfaces/INotification.repository';
import { NotificationRepository } from '@/repositories/notification.repository';
import { INotificationService } from '@/services/Interfaces/INotification.service';
import { NotificationService } from '@/services/notification.service';
import { IAdminService } from '@/services/Interfaces/IAdmin.service';
import { AdminService } from '@/services/admin.service';
import { IPasswordService } from '@/services/Interfaces/IPassword.service';
import { PasswordService } from '@/services/password.service';
import { IMentorAuthService } from '@/services/Interfaces/IMentor-auth.service';
import { MentorAuthService } from '@/services/mentor-auth.service';
import { IMentorService } from '@/services/Interfaces/IMentor.service';
import { MentorService } from '@/services/mentor.service';
import { PlannerTaskController } from '@/controllers/planner-task.controller';
import { IPlannerTaskService } from '@/services/Interfaces/IPlannerTask.service';
import { PlannerTaskService } from '@/services/planner-task.service';
import { IPlannerTaskRepository } from '@/repositories/interfaces/IPlannerTask.repository';
import { PlannerTaskRepository } from '@/repositories/planner-task.repository';

import { IMentorshipService } from '@/services/Interfaces/IMentorship.service';
import { MentorshipService } from '@/services/mentorship.service';
import { IWalletService } from '@/services/Interfaces/IWallet.service';
import { WalletService } from '@/services/wallet.service';
import { IMentorshipRepository } from '@/repositories/interfaces/IMentorship.repository';
import { MentorshipRepository } from '@/repositories/mentorship.repository';
import { IWalletRepository } from '@/repositories/interfaces/IWallet.repository';
import { WalletRepository } from '@/repositories/wallet.repository';
import { MentorshipController } from '@/controllers/mentorship.controller';
import { WalletController } from '@/controllers/Wallet.controller';
import { PomodoroController } from '@/controllers/pomodoro.controller';
import { IPomodoroService } from '@/services/Interfaces/IPomodoro.service';
import { PomodoroService } from '@/services/pomodoro.service';
import { IPomodoroRepository } from '@/repositories/interfaces/IPomodoro.repository';
import { PomodoroRepository } from '@/repositories/pomodoro.repository';
import { NoteController } from '@/controllers/note.controller';
import { NoteService } from '@/services/note.service';
import { NoteRepository } from '@/repositories/note.repository';
import { INoteService } from '@/services/Interfaces/INote.service';
import { INoteRepository } from '@/repositories/interfaces/INote.repository';

import { IBookingRepository } from '@/repositories/interfaces/IBooking.repository';
import { BookingRepository } from '@/repositories/booking.repository';
import { BookingService } from '@/services/booking.service';
import { BookingController } from '@/controllers/booking.controller';
import { IBookingService } from '@/services/Interfaces/IBooking.service';

import { IReviewRepository } from '@/repositories/interfaces/IReview.repository';
import { ReviewRepository } from '@/repositories/review.repository';
import { IReviewService } from '@/services/Interfaces/IReview.service';
import { ReviewService } from '@/services/review.service';
import { ReviewController } from '@/controllers/review.controller';
import { IBadgeRepository } from '@/repositories/interfaces/IBadge.repository';
import { BadgeRepository } from '@/repositories/badge.repository';
import { IPlanService } from '@/services/Interfaces/IPlan.service';
import { PlanService } from '@/services/plan.service';
import { IPlanRepository } from '@/repositories/interfaces/IPlan.repository';
import { planRepository } from '@/repositories/plan.repository';
import { PlanController } from '@/controllers/plan.controller';
import { BadgeController } from '@/controllers/Gamification/badge.controller';
import { IBadgeService } from '@/services/Gamification/interfaces/IBadge.service';
import { BadgeService } from '@/services/Gamification/badge.service';
import { IDailyStreakCalculator } from '@/services/Gamification/interfaces/IDaily-streak-calculator.service';
import { DailyStreakCalculator } from '@/services/Gamification/daily-streak-calculator.service';
import { UserStatsRepository } from '@/repositories/Gamification/user-stats.repository';
import { IUserStatsRepository } from '@/repositories/Gamification/interfaces/IUser-stats.repository';
import { IBadgeEvaluator } from '@/services/Gamification/interfaces/IBadge-evaluator';
import { TaskCountEvaluator } from '@/services/Gamification/task-count-evaluator.service';
import { PomodoroEvaluator } from '@/services/Gamification/pomodoro-evaluator.service';
import { BadgeTemplateResolverService } from '@/services/Gamification/badge-template-resolver.service';
import { IBadgeTemplateResolverService } from '@/services/Gamification/interfaces/IBadge-template-resolver.service';
import { IUserBadgeRepository } from '@/repositories/Gamification/interfaces/IUser-badge.repository';
import { UserBadgeRepository } from '@/repositories/Gamification/user-badge.repository';
import { ITaskGamificationHandleService } from '@/services/Gamification/interfaces/ITask-gamification-handle.service';
import { TaskGamificationHandleService } from '@/services/Gamification/task-gamification-handle.service';
import { BadgeGamificationService } from '@/services/Gamification/badge-gamification.service';
import { IBadgeGamificationService } from '@/services/Gamification/interfaces/IBadge-gamification.service';
import { IPomodoroGamificationService } from '@/services/Gamification/interfaces/IPomodoro-gamification.service';
import { PomodoroGamificationService } from '@/services/Gamification/pomodoro-gamification.service';


export const container = new Container();

container.bind<IBadgeRepository>(TYPES.BadgeRepository).to(BadgeRepository);

container.bind<AdminController>(TYPES.AdminController).to(AdminController);
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<MentorController>(TYPES.MentorController).to(MentorController);
container
    .bind<PaymentController>(TYPES.PaymentController)
    .to(PaymentController);
container.bind<ChatController>(TYPES.ChatController).to(ChatController);
container.bind<SocketController>(TYPES.SocketController).to(SocketController);
container
    .bind<MentorOnboardController>(TYPES.MentorOnboardController)
    .to(MentorOnboardController);
container
    .bind<PlannerTaskController>(TYPES.PlannerTaskController)
    .to(PlannerTaskController);
container
    .bind<MentorshipController>(TYPES.MentorshipController)
    .to(MentorshipController);
container.bind<WalletController>(TYPES.WalletController).to(WalletController);
container
    .bind<PomodoroController>(TYPES.PomodoroController)
    .to(PomodoroController);
container
    .bind<BookingController>(TYPES.BookingController)
    .to(BookingController);
container.bind<ReviewController>(TYPES.ReviewController).to(ReviewController);
container.bind<PlanController>(TYPES.PlanController).to(PlanController);
container.bind<BadgeController>(TYPES.BadgeController).to(BadgeController);

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
container
    .bind<ISocketService>(TYPES.SocketService)
    .to(SocketService)
    .inSingletonScope();
container.bind<IAdminAuthService>(TYPES.AdminAuthService).to(AdminAuthService);
container
    .bind<IMentorOnboardService>(TYPES.MentorOnboardService)
    .to(MentorOnboardService);
container
    .bind<INotificationService>(TYPES.NotificationService)
    .to(NotificationService);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService);
container.bind<IPasswordService>(TYPES.PasswordService).to(PasswordService);
container
    .bind<IMentorAuthService>(TYPES.MentorAuthService)
    .to(MentorAuthService);
container.bind<IMentorService>(TYPES.MentorService).to(MentorService);
container
    .bind<IPlannerTaskService>(TYPES.PlannerTaskService)
    .to(PlannerTaskService);
container
    .bind<IMentorshipService>(TYPES.MentorshipService)
    .to(MentorshipService);
container.bind<IWalletService>(TYPES.WalletService).to(WalletService);
container.bind<IBookingService>(TYPES.BookingService).to(BookingService);
container.bind<IReviewService>(TYPES.ReviewService).to(ReviewService);
container.bind<IPlanService>(TYPES.PlanService).to(PlanService);
container.bind<IBadgeService>(TYPES.BadgeService).to(BadgeService);
container
    .bind<IDailyStreakCalculator>(TYPES.DailyStreakCalculator)
    .to(DailyStreakCalculator);
container.bind<IBadgeEvaluator>(TYPES.IBadgeEvaluator).to(TaskCountEvaluator);
container.bind<IBadgeEvaluator>(TYPES.IBadgeEvaluator).to(PomodoroEvaluator);
container
    .bind<IBadgeTemplateResolverService>(TYPES.BadgeTemplateResolverService)
    .to(BadgeTemplateResolverService);
container
    .bind<ITaskGamificationHandleService>(TYPES.TaskGamificationHandler)
    .to(TaskGamificationHandleService);
container
    .bind<IBadgeGamificationService>(TYPES.BadgeGamficationService)
    .to(BadgeGamificationService);
container
    .bind<IPomodoroGamificationService>(TYPES.PomodoroGamificationService)
    .to(PomodoroGamificationService);

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
container
    .bind<INotificationRepository>(TYPES.NotificationRepository)
    .to(NotificationRepository);
container
    .bind<IPlannerTaskRepository>(TYPES.PlannerTaskRepository)
    .to(PlannerTaskRepository);
container
    .bind<IMentorshipRepository>(TYPES.MentorshipRepository)
    .to(MentorshipRepository);
container.bind<IWalletRepository>(TYPES.WalletRepository).to(WalletRepository);

container.bind<IPomodoroService>(TYPES.PomodoroService).to(PomodoroService);
container
    .bind<IPomodoroRepository>(TYPES.PomodoroRepository)
    .to(PomodoroRepository);

container.bind<NoteController>(TYPES.NoteController).to(NoteController);
container.bind<INoteService>(TYPES.NoteService).to(NoteService);
container.bind<INoteRepository>(TYPES.NoteRepository).to(NoteRepository);
container
    .bind<IBookingRepository>(TYPES.BookingRepository)
    .to(BookingRepository);
container.bind<IReviewRepository>(TYPES.ReviewRepository).to(ReviewRepository);
container.bind<IPlanRepository>(TYPES.planRepository).to(planRepository);
container
    .bind<IUserStatsRepository>(TYPES.UserStatsRepository)
    .to(UserStatsRepository);
container
    .bind<IUserBadgeRepository>(TYPES.UserBadgeRepository)
    .to(UserBadgeRepository);
