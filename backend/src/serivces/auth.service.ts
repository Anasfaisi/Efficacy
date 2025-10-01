import { injectable, inject } from "inversify";
import jwt from "jsonwebtoken";
import { TYPES } from "@/types/inversify-key.types";
import bcrypt from "bcrypt";
import { IAuthService } from "./Interfaces/IAuth.service";
import { IAdminRepository } from "@/repositories/interfaces/IAdmin.repository";
import { IUserRepository } from "@/repositories/interfaces/IUser.repository";
import { IMentorRepository } from "@/repositories/interfaces/IMentor.repository";
import { IUnverifiedUserRepository } from "@/repositories/interfaces/IUnverified-user.repository";
import { ITokenService } from "./Interfaces/IToken.service";
import { IOtpService } from "./Interfaces/IOtp.service";
import { IValidationService } from "./Interfaces/IValidation.service";
import { IGoogleVerificationService } from "./Interfaces/IGoogle-verifcation.service";
import { Repositories, Role } from "@/types/role.types";
import {
  CurrentUserResDto,
  LoginResponseDTO,
  OtpVerificationResponseDto,
  RegisterInitResponseDto,
} from "@/Dto/responseDto";
import { CurrentUserReqDto, LoginRequestDto } from "@/Dto/requestDto";


@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.AdminRepository) private _adminRepository: IAdminRepository,
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.MentorRepository)
    private _mentorRepository: IMentorRepository,
    @inject(TYPES.UnverifiedUserRepository)
    private _unverifiedUserRepository: IUnverifiedUserRepository,

    @inject(TYPES.TokenService) private _tokenService: ITokenService,
    @inject(TYPES.OtpService) private _otpService: IOtpService,
    @inject(TYPES.ValidationService)
    private _validationService: IValidationService,
    @inject(TYPES.GoogleVerificationService)
    private _googleVerificationService: IGoogleVerificationService
  ) {}

  // async login(email: string, password: string, role: Role) {
  //   this._validationService.validateLoginInput({
  //     email,
  //     password,
  //     role,
  //   });
  //   let repository: Repositories;
  //   if (role === "admin") {
  //     repository = this._adminRepository;
  //   } else if (role === "mentor") {
  //     repository = this._mentorRepository;
  //   } else if (role === "user") {
  //     repository = this._userRepository;
  //   } else {
  //     throw new Error("Invalid role");
  //   }
  //   const account = await repository.findByEmail(email);
  //   console.log(account)
  //   if (!account || account.role !== role) {
  //     throw new Error(`Not authorized as ${role}`);
  //   }

  //   if (!(await bcrypt.compare(password, account.password))) {
  //     throw new Error("Invalid email or password");
  //   }

  //   const accessToken = this._tokenService.generateAccessToken(
  //     account.id,
  //     account.role
  //   );

  //   const refreshToken = this._tokenService.generateRefreshToken(
  //     account.id,
  //     account.role
  //   );

  //   return new LoginResponseDTO(accessToken, refreshToken, {
  //     id: account.id.toString(),
  //     name: account.name,
  //     email: account.email,
  //     role: account.role,
  //   });
  // }

  async login(loginDto : LoginRequestDto):Promise<LoginResponseDTO> {
    
    this._validationService.validateLoginInput({
      email:loginDto.email,
      password:loginDto.password,
      role:loginDto.role,
    });

    const account = await this._userRepository.findByEmail(loginDto.email);
    if (!account) throw new Error("User not found");

    if (!(await bcrypt.compare(loginDto.password, account.password))) {
      throw new Error("Invalid email or password");
    }

    const accessToken = this._tokenService.generateAccessToken(
      account.id,
      account.role
    );

    const refreshToken = this._tokenService.generateRefreshToken(
      account.id,
      account.role
    );

    return new LoginResponseDTO(accessToken, refreshToken, {
      id: account.id.toString(),
      name: account.name,
      email: account.email,
      role: account.role as Role,
      subscription: account.subscription,
    });
  }

 async getCurrentUser(id: string) {
      const reqDto = new CurrentUserReqDto(id)
      const user = await this._userRepository.findById(reqDto.id)
      const resDto = new CurrentUserResDto({
        id:user?.id!,
        name:user?.name!,
        email:user?.email!,
        role:user?.role!,
        subscription:user?.subscription!

      })
      console.log(resDto,2222);
      
      return resDto
  }
  

  async registerInit({
    email,
    password,
    name,
    role,
  }: {
    email: string;
    password: string;
    name: string;
    role: Role;
  }) {
    this._validationService.validateRegisterInput({ email, password, name });

    let repository: IUserRepository | IMentorRepository;
    if (role === "mentor") {
      repository = this._mentorRepository;
    } else if (role === "user") {
      repository = this._userRepository;
    } else {
      throw new Error("invalid role");
    }

    const account = await repository.findByEmail(email);
    if (account) throw new Error("Email already registered");

    const existingUnverified =
      await this._unverifiedUserRepository.findByEmail(email);
    if (existingUnverified) throw new Error(`OTP already sent to ${email}`);

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = await this._otpService.generateOtp();
    console.log(otp, "in register");
    const unverifiedUser = await this._unverifiedUserRepository.create({
      email,
      password: hashedPassword,
      name,
      role,
      otp,
      otpExpiresAt: new Date(Date.now() + 1 * 60 * 1000),
    });

    await this._otpService.sendOtp(email, otp);
    return new RegisterInitResponseDto(
      unverifiedUser.email,
      unverifiedUser.role
    );
  }



  async registerVerify(email: string, otp: string) {
    const unverifiedUser =
      await this._unverifiedUserRepository.findByEmail(email);
    if (!unverifiedUser)
      throw new Error("No pending registration for this email");

    if (unverifiedUser.otp !== otp) throw new Error("Invalid OTP");
    if (unverifiedUser.otpExpiresAt < new Date())
      throw new Error("OTP expired");
    let repository: IUserRepository | IMentorRepository;
    if (unverifiedUser.role === "mentor") {
      repository = this._mentorRepository;
    } else if (unverifiedUser.role === "user") {
      repository = this._userRepository;
    } else {
      throw new Error("invalid role");
    }

    const user = await repository.createUser({
      email: unverifiedUser.email,
      password: unverifiedUser.password,
      name: unverifiedUser.name,
      role: unverifiedUser.role,
    });

    await this._unverifiedUserRepository.deleteByEmail(email);
    const accessToken = this._tokenService.generateAccessToken(
      user.id,
      user.role
    );
    const refreshToken = this._tokenService.generateRefreshToken(
      user.id,
      user.role
    );
    // await this._unverifiedUserRepository.deleteByEmail(unverifiedUser.email);
    return new OtpVerificationResponseDto(accessToken, refreshToken, {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }

  async resendOtp(email: string) {
    const unverifiedUser =
      await this._unverifiedUserRepository.findByEmail(email);
    if (!unverifiedUser)
      throw new Error("Session expired, please register again");

    const otp = await this._otpService.generateOtp();
    console.log(otp, "in resend");
    const updatedUser = await this._unverifiedUserRepository.updateByEmail(
      email,
      {
        otp,
        otpExpiresAt: new Date(Date.now() + 1 * 60 * 1000),
      }
    );
    await this._otpService.sendOtp(email, otp);
    console.log(updatedUser);

    return new RegisterInitResponseDto(
      unverifiedUser.email,
      unverifiedUser.role
    );
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this._userRepository.findByEmail(email);
    console.log(user);
    if (!user) throw new Error("User not found");

    const resetToken = this._tokenService.generatePasswordResetToken(user.id);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await this._otpService.sendEmail(
      user.email,
      "Reset Your Password",
      `Click here to reset: ${resetLink}`
    );
    return { message: "Reset link sent to email" };
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const payload = this._tokenService.verifyPasswordResetToken(token);
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this._userRepository.updatePasswordById(payload.id, hashedPassword);

      return { message: "Password reset successful" };
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  }

  async refreshToken(refreshToken: string) {
    const payload = this._tokenService.verifyRefreshToken(refreshToken);
    const repository =
      payload.role === "admin"
        ? this._adminRepository
        : payload.role === "mentor"
          ? this._mentorRepository
          : this._userRepository;

    const account = await repository.findById(payload.id);
    if (!account) {
      throw new Error("User not found");
    }

    const accessToken = this._tokenService.generateAccessToken(
      account.id,
      account.role
    );
    const newRefreshToken = this._tokenService.generateRefreshToken(
      account.id,
      account.role
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

 

  async loginWithGoogle(googleToken: string, role: "user" | "mentor") {
    this._validationService.validateGoogleLoginInput({
      role,
      endpoint: role,
    });
    const ticket = await this._googleVerificationService.verify(googleToken);
    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new Error("Google login failed: No email found");
    }

    let repository: IUserRepository | IMentorRepository;
    if (role === "mentor") {
      repository = this._mentorRepository;
    } else if (role === "user") {
      repository = this._userRepository;
    } else {
      throw new Error("invalid role");
    }

    let account = await repository.findByEmail(payload.email);
    if (!account) {
      account = await repository.createUser({
        email: payload.email,
        name: payload.name || "Google User",
        googleId: payload.sub,
        role,
        password:
          "$2a$10$BvNq8r.X.3zVWQs2Q7wJmeyGYqLMV/P6cyVUFyoLsEL1rXEmWMiiW" /*string = Abcd@1234*/,
      });
    }

    const accessToken = this._tokenService.generateAccessToken(
      account!.id,
      account!.role
    );
    const refreshToken = this._tokenService.generateRefreshToken(
      account!.id,
      account!.role
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: account!.id,
        email: account!.email,
        name: account!.name,
        role: account!.role,
      },
    };
  }


   

  /*======= admin auth ===========*/

  async AdminLogin(email: string, password: string, role: Role) {

    this._validationService.validateLoginInput({
      email,
      password,
      role,
    });

    const account = await this._adminRepository.findByEmail(email);
    if (!account) throw new Error("User not found");

    if (!(await bcrypt.compare(password, account.password))) {
      throw new Error("Invalid email or password");
    }

    const accessToken = this._tokenService.generateAccessToken(
      account.id,
      account.role
    );

    const refreshToken = this._tokenService.generateRefreshToken(
      account.id,
      account.role
    );

    return new LoginResponseDTO(accessToken, refreshToken, {
      id: account.id.toString(),
      name: account.name,
      email: account.email,
      role: role,
    });
  }



  /*=============== mentor Auth =======================*/
  async mentorLogin(email: string, password: string, role: Role) {
    this._validationService.validateLoginInput({
      email,
      password,
      role,
    });

    const account = await this._mentorRepository.findByEmail(email);
    if (!account) throw new Error("User not found");

    if (!(await bcrypt.compare(password, account.password))) {
      throw new Error("Invalid email or password");
    }

    const accessToken = this._tokenService.generateAccessToken(
      account.id,
      account.role
    );

    const refreshToken = this._tokenService.generateRefreshToken(
      account.id,
      account.role
    );

    return new LoginResponseDTO(accessToken, refreshToken, {
      id: account.id.toString(),
      name: account.name,
      email: account.email,
      role: role,
    });
  }

        
    async MentorRegisterInit({
    email,
    password,
    name,
    role,
  }: {
    email: string;
    password: string;
    name: string;
    role: Role;
  }) {
    this._validationService.validateRegisterInput({ email, password, name });

    const account = await this._mentorRepository.findByEmail(email);
    if (account) throw new Error("Email already registered");

    const existingUnverified =
      await this._unverifiedUserRepository.findByEmail(email);
    if (existingUnverified) throw new Error(`OTP already sent to ${email}`);

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = await this._otpService.generateOtp();
    console.log(otp, "in register");
    const unverifiedUser = await this._unverifiedUserRepository.create({
      email,
      password: hashedPassword,
      name,
      role,
      otp,
      otpExpiresAt: new Date(Date.now() + 1 * 60 * 1000),
    });

    await this._otpService.sendOtp(email, otp);
    return new RegisterInitResponseDto(
      unverifiedUser.email,
      unverifiedUser.role
    );
  }
}
