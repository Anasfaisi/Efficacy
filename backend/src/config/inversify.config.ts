import { UserRepository } from "@/repositories/UserRepository";
import { AdminController } from "@/controllers/adminController";
import { AuthService } from "@/serivces/AuthSerivice";
import { TYPES } from "@/types";
import { Container } from "inversify";
import { AdminRepository } from "@/repositories/adminRepository";
import { TokenService } from "@/serivces/TokenService";
import { ValidationService } from "@/serivces/ValidationService";
import { UserController } from "@/controllers/UserController";
import { AdminAccessMiddleware } from "@/middleware/adminAuthMiddleware";

export const container = new Container();

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<AdminController>(TYPES.AdminController).to(AdminController);
container.bind<AdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<TokenService>(TYPES.TokenService).to(TokenService);
container.bind<ValidationService>(TYPES.ValidationService).to(ValidationService);
container.bind<UserController>(TYPES.UserController).to(UserController)
container.bind<AdminAccessMiddleware>(TYPES.AdminAccessMiddleware).to(AdminAccessMiddleware)