export const TYPES = {
  AuthService: Symbol("AuthService"),
  ValidationService: Symbol("ValidationService"),
  TokenService: Symbol('TokenService'),
  
  AdminRepository: Symbol("AdminRepository"),
  UserRepository: Symbol("UserRepository"),
  
  AdminController: Symbol("AdminController"),
  UserController: Symbol('UserController'),
  
  AdminAccessMiddleware : Symbol('AdminAccessMiddleware'),
};
