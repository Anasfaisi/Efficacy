import { UserRepository } from '@/repositories/user.repository';
import { AdminController } from '@/controllers/admin.controller';
import { AuthService } from '@/serivces/auth.service';
import { TYPES } from '@/config/inversify-key.types';
import { Container } from 'inversify';
import { AdminRepository } from '@/repositories/admin.repository';
import { TokenService } from '@/serivces/token.service';
import { ValidationService } from '@/serivces/validation.service';
import { UserController } from '@/controllers/user.controller';
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
import { PlannerTaskController } from '@/controllers/planner-task.controller';
import { IPlannerTaskService } from '@/serivces/Interfaces/IPlannerTask.service';
import { PlannerTaskService } from '@/serivces/planner-task.service';
import { IPlannerTaskRepository } from '@/repositories/interfaces/IPlannerTask.repository';
import { PlannerTaskRepository } from '@/repositories/planner-task.repository';

import { IMentorshipService } from '@/serivces/Interfaces/IMentorship.service';
import { MentorshipService } from '@/serivces/mentorship.service';
import { IWalletService } from '@/serivces/Interfaces/IWallet.service';
import { WalletService } from '@/serivces/wallet.service';
import { IMentorshipRepository } from '@/repositories/interfaces/IMentorship.repository';
import { MentorshipRepository } from '@/repositories/mentorship.repository';
import { IWalletRepository } from '@/repositories/interfaces/IWallet.repository';
import { WalletRepository } from '@/repositories/wallet.repository';
import { MentorshipController } from '@/controllers/mentorship.controller';
import { WalletController } from '@/controllers/Wallet.controller';
import { PomodoroController } from '@/controllers/pomodoro.controller';
import { IPomodoroService } from '@/serivces/Interfaces/IPomodoro.service';
import { PomodoroService } from '@/serivces/pomodoro.service';
import { IPomodoroRepository } from '@/repositories/interfaces/IPomodoro.repository';
import { PomodoroRepository } from '@/repositories/pomodoro.repository';
import { NoteController } from '@/controllers/note.controller';
import { NoteService } from '@/serivces/note.service';
import { NoteRepository } from '@/repositories/note.repository';
import { INoteService } from '@/serivces/Interfaces/INote.service';
import { INoteRepository } from '@/repositories/interfaces/INote.repository';

import { IBookingRepository } from '@/repositories/interfaces/IBooking.repository';
import { BookingRepository } from '@/repositories/booking.repository';
import { BookingService } from '@/serivces/booking.service';
import { BookingController } from '@/controllers/booking.controller';
import { IBookingService } from '@/serivces/Interfaces/IBooking.service';

import { IReviewRepository } from '@/repositories/interfaces/IReview.repository';
import { ReviewRepository } from '@/repositories/review.repository';
import { IReviewService } from '@/serivces/Interfaces/IReview.service';
import { ReviewService } from '@/serivces/review.service';
import { ReviewController } from '@/controllers/review.controller';
import { IBadgeRepository } from '@/repositories/interfaces/IBadge.repository';
import { BadgeRepository } from '@/repositories/badge.repository';
import { IPlanService } from '@/serivces/Interfaces/IPlan.service';
import { PlanService } from '@/serivces/plan.service';
import { IPlanRepository } from '@/repositories/interfaces/IPlan.repository';
import { planRepository } from '@/repositories/plan.repository';
import { PlanController } from '@/controllers/plan.controller';
import { BadgeController } from '@/controllers/Gamification/badge.controller';
import { IBadgeService } from '@/serivces/Gamification/interfaces/IBadge.service';
import { BadgeService } from '@/serivces/Gamification/badge.service';
import { IDailyStreakCalculator } from '@/serivces/Gamification/interfaces/IDaily-streak-calculator.service';
import { DailyStreakCalculator } from '@/serivces/Gamification/daily-streak-calculator.service';
import { UserStatsRepository } from '@/repositories/Gamification/user-stats.repository';
import { IUserStatsRepository } from '@/repositories/Gamification/interfaces/IUser-stats.repository';
import { IBadgeEvaluator } from '@/serivces/Gamification/interfaces/IBadge-evaluator';
import { TaskCountEvaluator } from '@/serivces/Gamification/task-count-evaluator.service';
import { PomodoroEvaluator } from '@/serivces/Gamification/pomodoro-evaluator.service';
import { BadgeTemplateResolverService } from '@/serivces/Gamification/badge-template-resolver.service';
import { IBadgeTemplateResolverService } from '@/serivces/Gamification/interfaces/IBadge-template-resolver.service';
import { IUserBadgeRepository } from '@/repositories/Gamification/interfaces/IUser-badge.repository';
import { UserBadgeRepository } from '@/repositories/Gamification/user-badge.repository';
import { ITaskGamificationHandleService } from '@/serivces/Gamification/interfaces/ITask-Gamification-handle.service';
import { TaskGamificationHandleService } from '@/serivces/Gamification/task-gamification-handle.service';
import { BadgeGamificationService } from '@/serivces/Gamification/badge-gamification.service';
import { IBadgeGamificationService } from '@/serivces/Gamification/interfaces/IBadge-gamification.service';
import { IPomodoroGamificationService } from '@/serivces/Gamification/interfaces/IPomodoro-gamification.service';
import { PomodoroGamificationService } from '@/serivces/Gamification/pomodoro-gamification.service';

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
