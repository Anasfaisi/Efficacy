export const TYPES = {
  AuthService: Symbol("AuthService"),
  ValidationService: Symbol("ValidationService"),
  TokenService: Symbol("TokenService"),
  GoogleVerificationService: Symbol("GooGoogleVerificationService"),
  OtpService :Symbol('OtpService'),
  PaymentService:Symbol('PaymentService'),

  AdminRepository: Symbol("AdminRepository"),
  UserRepository: Symbol("UserRepository"),
  MentorRepository: Symbol("MentorRepository"),
  UnverifiedUserRepository :Symbol("UnverifiedUserRepository"),

  AdminController: Symbol("AdminController"),
  UserController: Symbol("UserController"),
  MentorController: Symbol("MentorController"),
  PaymentController: Symbol("paymentController"),

  AdminAccessMiddleware: Symbol("AdminAccessMiddleware"),
};
