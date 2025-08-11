export const TYPES = {
  AuthService: Symbol("AuthService"),
  ValidationService: Symbol("ValidationService"),
  TokenService: Symbol("TokenService"),
  GoogleVerificationService: Symbol("GooGoogleVerificationService"),

  AdminRepository: Symbol("AdminRepository"),
  UserRepository: Symbol("UserRepository"),
  MentorRepository: Symbol("MentorRepository"),

  AdminController: Symbol("AdminController"),
  UserController: Symbol("UserController"),
  MentorController: Symbol("MentorController"),

  AdminAccessMiddleware: Symbol("AdminAccessMiddleware"),
};
