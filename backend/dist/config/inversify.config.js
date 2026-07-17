"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const user_repository_1 = require("@/repositories/user.repository");
const admin_controller_1 = require("@/controllers/admin.controller");
const auth_service_1 = require("@/services/auth.service");
const inversify_key_types_1 = require("@/config/inversify-key.types");
const inversify_1 = require("inversify");
const admin_repository_1 = require("@/repositories/admin.repository");
const token_service_1 = require("@/services/token.service");
const validation_service_1 = require("@/services/validation.service");
const user_controller_1 = require("@/controllers/user.controller");
const mentor_repository_1 = require("@/repositories/mentor.repository");
const mentor_controller_1 = require("@/controllers/mentor.controller");
const google_verification_service_1 = require("@/services/google-verification.service");
const unverified_user_repository_1 = require("@/repositories/unverified-user.repository");
const otp_service_1 = require("@/services/otp.service");
const payment_service_1 = require("@/services/payment.service");
const payment_controller_1 = require("@/controllers/payment.controller");
const chat_controller_1 = require("@/controllers/chat.controller");
const socket_service_1 = require("@/services/socket.service");
const socket_controller_1 = require("@/controllers/socket.controller");
const message_repository_1 = require("@/repositories/message.repository");
const chat_service_1 = require("@/services/chat.service");
const chat_repository_1 = require("@/repositories/chat.repository");
const admin_auth_service_1 = require("@/services/admin-auth.service");
const mentor_onboard_controller_1 = require("@/controllers/mentor-onboard.controller");
const mentor_onboard_service_1 = require("@/services/mentor-onboard.service");
const notification_service_1 = require("@/services/notification.service");
const admin_service_1 = require("@/services/admin.service");
const password_service_1 = require("@/services/password.service");
const mentor_auth_service_1 = require("@/services/mentor-auth.service");
const mentor_service_1 = require("@/services/mentor.service");
const planner_task_controller_1 = require("@/controllers/planner-task.controller");
const planner_task_service_1 = require("@/services/planner-task.service");
const planner_task_repository_1 = require("@/repositories/planner-task.repository");
const mentorship_service_1 = require("@/services/mentorship.service");
const wallet_service_1 = require("@/services/wallet.service");
const mentorship_repository_1 = require("@/repositories/mentorship.repository");
const wallet_repository_1 = require("@/repositories/wallet.repository");
const mentorship_controller_1 = require("@/controllers/mentorship.controller");
const Wallet_controller_1 = require("@/controllers/Wallet.controller");
const pomodoro_controller_1 = require("@/controllers/pomodoro.controller");
const pomodoro_service_1 = require("@/services/pomodoro.service");
const pomodoro_repository_1 = require("@/repositories/pomodoro.repository");
const note_controller_1 = require("@/controllers/note.controller");
const note_service_1 = require("@/services/note.service");
const note_repository_1 = require("@/repositories/note.repository");
const booking_repository_1 = require("@/repositories/booking.repository");
const booking_service_1 = require("@/services/booking.service");
const booking_controller_1 = require("@/controllers/booking.controller");
const review_repository_1 = require("@/repositories/review.repository");
const review_service_1 = require("@/services/review.service");
const review_controller_1 = require("@/controllers/review.controller");
const badge_repository_1 = require("@/repositories/badge.repository");
const plan_service_1 = require("@/services/plan.service");
const plan_repository_1 = require("@/repositories/plan.repository");
const plan_controller_1 = require("@/controllers/plan.controller");
const badge_controller_1 = require("@/controllers/Gamification/badge.controller");
const badge_service_1 = require("@/services/Gamification/badge.service");
const daily_streak_calculator_service_1 = require("@/services/Gamification/daily-streak-calculator.service");
const user_stats_repository_1 = require("@/repositories/Gamification/user-stats.repository");
const task_count_evaluator_service_1 = require("@/services/Gamification/task-count-evaluator.service");
const pomodoro_evaluator_service_1 = require("@/services/Gamification/pomodoro-evaluator.service");
const badge_template_resolver_service_1 = require("@/services/Gamification/badge-template-resolver.service");
const user_badge_repository_1 = require("@/repositories/Gamification/user-badge.repository");
const task_gamification_handle_service_1 = require("@/services/Gamification/task-gamification-handle.service");
const badge_gamification_service_1 = require("@/services/Gamification/badge-gamification.service");
const pomodoro_gamification_service_1 = require("@/services/Gamification/pomodoro-gamification.service");
const Notification_repository_1 = require("@/repositories/Notification.repository");
exports.container = new inversify_1.Container();
exports.container.bind(inversify_key_types_1.TYPES.BadgeRepository).to(badge_repository_1.BadgeRepository);
exports.container.bind(inversify_key_types_1.TYPES.AdminController).to(admin_controller_1.AdminController);
exports.container.bind(inversify_key_types_1.TYPES.UserController).to(user_controller_1.UserController);
exports.container.bind(inversify_key_types_1.TYPES.MentorController).to(mentor_controller_1.MentorController);
exports.container
    .bind(inversify_key_types_1.TYPES.PaymentController)
    .to(payment_controller_1.PaymentController);
exports.container.bind(inversify_key_types_1.TYPES.ChatController).to(chat_controller_1.ChatController);
exports.container.bind(inversify_key_types_1.TYPES.SocketController).to(socket_controller_1.SocketController);
exports.container
    .bind(inversify_key_types_1.TYPES.MentorOnboardController)
    .to(mentor_onboard_controller_1.MentorOnboardController);
exports.container
    .bind(inversify_key_types_1.TYPES.PlannerTaskController)
    .to(planner_task_controller_1.PlannerTaskController);
exports.container
    .bind(inversify_key_types_1.TYPES.MentorshipController)
    .to(mentorship_controller_1.MentorshipController);
exports.container.bind(inversify_key_types_1.TYPES.WalletController).to(Wallet_controller_1.WalletController);
exports.container
    .bind(inversify_key_types_1.TYPES.PomodoroController)
    .to(pomodoro_controller_1.PomodoroController);
exports.container
    .bind(inversify_key_types_1.TYPES.BookingController)
    .to(booking_controller_1.BookingController);
exports.container.bind(inversify_key_types_1.TYPES.ReviewController).to(review_controller_1.ReviewController);
exports.container.bind(inversify_key_types_1.TYPES.PlanController).to(plan_controller_1.PlanController);
exports.container.bind(inversify_key_types_1.TYPES.BadgeController).to(badge_controller_1.BadgeController);
exports.container.bind(inversify_key_types_1.TYPES.AuthService).to(auth_service_1.AuthService);
exports.container.bind(inversify_key_types_1.TYPES.TokenService).to(token_service_1.TokenService);
exports.container.bind(inversify_key_types_1.TYPES.OtpService).to(otp_service_1.OtpService);
exports.container
    .bind(inversify_key_types_1.TYPES.ValidationService)
    .to(validation_service_1.ValidationService);
exports.container
    .bind(inversify_key_types_1.TYPES.GoogleVerificationService)
    .to(google_verification_service_1.GoogleVerificationService);
exports.container.bind(inversify_key_types_1.TYPES.PaymentService).to(payment_service_1.PaymentService);
exports.container.bind(inversify_key_types_1.TYPES.ChatService).to(chat_service_1.ChatService);
exports.container
    .bind(inversify_key_types_1.TYPES.SocketService)
    .to(socket_service_1.SocketService)
    .inSingletonScope();
exports.container.bind(inversify_key_types_1.TYPES.AdminAuthService).to(admin_auth_service_1.AdminAuthService);
exports.container
    .bind(inversify_key_types_1.TYPES.MentorOnboardService)
    .to(mentor_onboard_service_1.MentorOnboardService);
exports.container
    .bind(inversify_key_types_1.TYPES.NotificationService)
    .to(notification_service_1.NotificationService);
exports.container.bind(inversify_key_types_1.TYPES.AdminService).to(admin_service_1.AdminService);
exports.container.bind(inversify_key_types_1.TYPES.PasswordService).to(password_service_1.PasswordService);
exports.container
    .bind(inversify_key_types_1.TYPES.MentorAuthService)
    .to(mentor_auth_service_1.MentorAuthService);
exports.container.bind(inversify_key_types_1.TYPES.MentorService).to(mentor_service_1.MentorService);
exports.container
    .bind(inversify_key_types_1.TYPES.PlannerTaskService)
    .to(planner_task_service_1.PlannerTaskService);
exports.container
    .bind(inversify_key_types_1.TYPES.MentorshipService)
    .to(mentorship_service_1.MentorshipService);
exports.container.bind(inversify_key_types_1.TYPES.WalletService).to(wallet_service_1.WalletService);
exports.container.bind(inversify_key_types_1.TYPES.BookingService).to(booking_service_1.BookingService);
exports.container.bind(inversify_key_types_1.TYPES.ReviewService).to(review_service_1.ReviewService);
exports.container.bind(inversify_key_types_1.TYPES.PlanService).to(plan_service_1.PlanService);
exports.container.bind(inversify_key_types_1.TYPES.BadgeService).to(badge_service_1.BadgeService);
exports.container
    .bind(inversify_key_types_1.TYPES.DailyStreakCalculator)
    .to(daily_streak_calculator_service_1.DailyStreakCalculator);
exports.container.bind(inversify_key_types_1.TYPES.IBadgeEvaluator).to(task_count_evaluator_service_1.TaskCountEvaluator);
exports.container.bind(inversify_key_types_1.TYPES.IBadgeEvaluator).to(pomodoro_evaluator_service_1.PomodoroEvaluator);
exports.container
    .bind(inversify_key_types_1.TYPES.BadgeTemplateResolverService)
    .to(badge_template_resolver_service_1.BadgeTemplateResolverService);
exports.container
    .bind(inversify_key_types_1.TYPES.TaskGamificationHandler)
    .to(task_gamification_handle_service_1.TaskGamificationHandleService);
exports.container
    .bind(inversify_key_types_1.TYPES.BadgeGamficationService)
    .to(badge_gamification_service_1.BadgeGamificationService);
exports.container
    .bind(inversify_key_types_1.TYPES.PomodoroGamificationService)
    .to(pomodoro_gamification_service_1.PomodoroGamificationService);
exports.container.bind(inversify_key_types_1.TYPES.UserRepository).to(user_repository_1.UserRepository);
exports.container
    .bind(inversify_key_types_1.TYPES.AdminRepository)
    .to(admin_repository_1.AdminRepository);
exports.container.bind(inversify_key_types_1.TYPES.MentorRepository).to(mentor_repository_1.MentorRepository);
exports.container
    .bind(inversify_key_types_1.TYPES.UnverifiedUserRepository)
    .to(unverified_user_repository_1.UnverifiedUserRepository);
exports.container.bind(inversify_key_types_1.TYPES.ChatRepository).to(chat_repository_1.ChatRepository);
exports.container
    .bind(inversify_key_types_1.TYPES.MessageRepository)
    .to(message_repository_1.MessageRepository);
exports.container
    .bind(inversify_key_types_1.TYPES.NotificationRepository)
    .to(Notification_repository_1.NotificationRepository);
exports.container
    .bind(inversify_key_types_1.TYPES.PlannerTaskRepository)
    .to(planner_task_repository_1.PlannerTaskRepository);
exports.container
    .bind(inversify_key_types_1.TYPES.MentorshipRepository)
    .to(mentorship_repository_1.MentorshipRepository);
exports.container.bind(inversify_key_types_1.TYPES.WalletRepository).to(wallet_repository_1.WalletRepository);
exports.container.bind(inversify_key_types_1.TYPES.PomodoroService).to(pomodoro_service_1.PomodoroService);
exports.container
    .bind(inversify_key_types_1.TYPES.PomodoroRepository)
    .to(pomodoro_repository_1.PomodoroRepository);
exports.container.bind(inversify_key_types_1.TYPES.NoteController).to(note_controller_1.NoteController);
exports.container.bind(inversify_key_types_1.TYPES.NoteService).to(note_service_1.NoteService);
exports.container.bind(inversify_key_types_1.TYPES.NoteRepository).to(note_repository_1.NoteRepository);
exports.container
    .bind(inversify_key_types_1.TYPES.BookingRepository)
    .to(booking_repository_1.BookingRepository);
exports.container.bind(inversify_key_types_1.TYPES.ReviewRepository).to(review_repository_1.ReviewRepository);
exports.container.bind(inversify_key_types_1.TYPES.planRepository).to(plan_repository_1.planRepository);
exports.container
    .bind(inversify_key_types_1.TYPES.UserStatsRepository)
    .to(user_stats_repository_1.UserStatsRepository);
exports.container
    .bind(inversify_key_types_1.TYPES.UserBadgeRepository)
    .to(user_badge_repository_1.UserBadgeRepository);
//# sourceMappingURL=inversify.config.js.map