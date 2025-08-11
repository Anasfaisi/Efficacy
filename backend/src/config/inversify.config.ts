import { UserRepository } from "@/repositories/UserRepository";
import { AdminController } from "@/controllers/adminController";
import { AuthService } from "@/serivces/AuthSerivice";
import { TYPES } from "@/types";
import { Container, ContainerModule } from "inversify";
import { AdminRepository } from "@/repositories/adminRepository";
import { TokenService } from "@/serivces/TokenService";
import { ValidationService } from "@/serivces/ValidationService";
import { UserController } from "@/controllers/UserController";
import { AdminAccessMiddleware } from "@/middleware/adminAuthMiddleware";
import { MentorRepository } from "@/repositories/mentorRepository";
import { MentorController } from "@/controllers/mentorController";
import { GoogleVerificationService } from "@/serivces/GoogleVerificationService";

export const container = new Container();

container.bind<AdminController>(TYPES.AdminController).to(AdminController);
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<MentorController>(TYPES.MentorController).to(MentorController);

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<TokenService>(TYPES.TokenService).to(TokenService);
container
  .bind<ValidationService>(TYPES.ValidationService)
  .to(ValidationService);
container
  .bind<GoogleVerificationService>(TYPES.GoogleVerificationService)
  .to(GoogleVerificationService);

container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<AdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<MentorRepository>(TYPES.MentorRepository).to(MentorRepository);
container
  .bind<AdminAccessMiddleware>(TYPES.AdminAccessMiddleware)
  .to(AdminAccessMiddleware);
