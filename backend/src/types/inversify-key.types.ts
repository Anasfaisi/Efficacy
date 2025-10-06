export const TYPES = {
    AuthService: Symbol('AuthService'),
    ValidationService: Symbol('ValidationService'),
    TokenService: Symbol('TokenService'),
    GoogleVerificationService: Symbol('GooGoogleVerificationService'),
    OtpService: Symbol('OtpService'),
    PaymentService: Symbol('PaymentService'),
    ChatService: Symbol('ChatService'),
    SocketService: Symbol('SockerService'),

    AdminRepository: Symbol('AdminRepository'),
    UserRepository: Symbol('UserRepository'),
    MentorRepository: Symbol('MentorRepository'),
    UnverifiedUserRepository: Symbol('UnverifiedUserRepository'),
    ChatRepository: Symbol('ChatRepository'),
    MessageRepository: Symbol('MessageRepository'),

    AdminController: Symbol('AdminController'),
    UserController: Symbol('UserController'),
    MentorController: Symbol('MentorController'),
    PaymentController: Symbol('paymentController'),
    ChatController: Symbol('chatController'),
    SocketController: Symbol('SocketController'),

    AdminAccessMiddleware: Symbol('AdminAccessMiddleware'),
};
