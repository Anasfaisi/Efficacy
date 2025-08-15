import { UserRepository } from "@/repositories/user.repository";
import { AdminController } from "@/controllers/admin.controller";
import { AuthService } from "@/serivces/auth.service";
import { TYPES } from "@/types";
import { Container, ContainerModule } from "inversify";
import { AdminRepository } from "@/repositories/admin.repository";
import { TokenService } from "@/serivces/token.service";
import { ValidationService } from "@/serivces/validation.service";
import { UserController } from "@/controllers/user.controller";
import { AdminAccessMiddleware } from "@/middleware/admin-auth.middleware";
import { MentorRepository } from "@/repositories/mentor.repository";
import { MentorController } from "@/controllers/mentor.controller";
import { GoogleVerificationService } from "@/serivces/google-verification.service";
import { UnverifiedUserRepository } from "@/repositories/unverified-user.repository";
import { OtpService } from "@/serivces/otp.service";

export const container = new Container();

container.bind<AdminController>(TYPES.AdminController).to(AdminController);
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<MentorController>(TYPES.MentorController).to(MentorController);

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<TokenService>(TYPES.TokenService).to(TokenService);
container.bind<OtpService>(TYPES.OtpService).to(OtpService)
container
  .bind<ValidationService>(TYPES.ValidationService)
  .to(ValidationService);
container
  .bind<GoogleVerificationService>(TYPES.GoogleVerificationService)
  .to(GoogleVerificationService);

container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<AdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<MentorRepository>(TYPES.MentorRepository).to(MentorRepository);
container.bind<UnverifiedUserRepository>(TYPES.UnverifiedUserRepository).to(UnverifiedUserRepository)

container
  .bind<AdminAccessMiddleware>(TYPES.AdminAccessMiddleware)
  .to(AdminAccessMiddleware);

