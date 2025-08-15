import { UserRepository } from "../repositories/user.repository";
import { MentorRepository } from "@/repositories/mentor.repository";
import { AdminRepository } from "@/repositories/admin.repository";
import { TokenService } from "./token.service";
import { injectable, inject } from "inversify";
import { TYPES } from "@/types";
import bcrypt from "bcrypt";
import { GoogleVerificationService } from "./google-verification.service";
import { UnverifiedUserRepository } from "@/repositories/unverified-user.repository";
import { OtpService } from "./otp.service";
import { IAuthService } from "./Interfaces/IAuth.service";
import { Types } from "mongoose";
import { ValidationService } from "./validation.service";
import { LoginResponseDTO } from "@/Dto/login.dto";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.AdminRepository) private adminRepository: AdminRepository,
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.MentorRepository) private mentorRepository: MentorRepository,
    @inject(TYPES.UnverifiedUserRepository)
    private unverifiedUserRepository: UnverifiedUserRepository,

    @inject(TYPES.TokenService) private _tokenService: TokenService,
    @inject(TYPES.OtpService) private _otpService: OtpService,
    @inject(TYPES.ValidationService)
    private _validationService: ValidationService,
    @inject(TYPES.GoogleVerificationService)
    private _googleVerificationService: GoogleVerificationService
  ) {}

  async login(
    email: string,
    password: string,
    role: "admin" | "user" | "mentor"
  ) {
    this._validationService.validateLoginInput({
      email,
      password,
      role,
      endpoint: "user",
    });
    let repository: AdminRepository | UserRepository | MentorRepository;
    if (role === "admin") {
      repository = this.adminRepository;
    } else if (role === "mentor") {
      repository = this.mentorRepository;
    } else if (role === "user") {
      repository = this.userRepository;
    } else {
      throw new Error("Invalid role");
    }
    const account = await repository.findByEmail(email);

    if (!account || account.role !== role) {
      throw new Error(`Not authorized as ${role}`);
    }

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
      role: account.role,
    });
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
    role: "mentor" | "user";
  }) {
    this._validationService.validateRegisterInput({ email, password, name });

    let repository: UserRepository | MentorRepository;
    if (role === "mentor") {
      repository = this.mentorRepository;
    } else if (role === "user") {
      repository = this.userRepository;
    } else {
      throw new Error("invalid role");
    }

    const account = await repository.findByEmail(email);
    if (account) throw new Error("Email already registered");

    const existingUnverified =
      await this.unverifiedUserRepository.findByEmail(email);
    if (existingUnverified) throw new Error(`OTP already sent to ${email}`);

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = await this._otpService.generateOtp();

    const unverifiedUser = await this.unverifiedUserRepository.create({
      email,
      password: hashedPassword,
      name,
      role,
      otp,
      otpExpiresAt: new Date(Date.now() + 1 * 60 * 1000),
    });

    await this._otpService.sendOtp(email, otp);
    return {
      tempUserId: unverifiedUser._id.toString(),
      email: unverifiedUser.email,
    };
  }

  async registerVerify(email: string, otp: string) {
    const unverifiedUser =
      await this.unverifiedUserRepository.findByEmail(email);
    if (!unverifiedUser)
      throw new Error("No pending registration for this email");

    if (unverifiedUser.otp !== otp) throw new Error("Invalid OTP");
    if (unverifiedUser.otpExpiresAt < new Date())
      throw new Error("OTP expired");

    const user = await this.userRepository.createUser({
      email: unverifiedUser.email,
      password: unverifiedUser.password,
      name: unverifiedUser.name,
      role: unverifiedUser.role,
    });

    await this.unverifiedUserRepository.deleteByEmail(email);
    const accessToken = this._tokenService.generateAccessToken(
      user.id,
      user.role
    );
    const refreshToken = this._tokenService.generateRefreshToken(
      user.id,
      user.role
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async registerUser({
    email,
    password,
    name,
    role,
  }: {
    email: string;
    password: string;
    name: string;
    role: "mentor" | "user";
  }) {
    this._validationService.validateRegisterInput({ email, password, name });

    let repository: UserRepository | MentorRepository;
    if (role === "mentor") {
      repository = this.mentorRepository;
    } else if (role === "user") {
      repository = this.userRepository;
    } else {
      throw new Error("invalid role");
    }
    const existingUser = await repository.findByEmail(email);
    if (existingUser) {
      throw new Error(`${role} already exists`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await repository.createUser({
      email,
      password: hashedPassword,
      name,
      role,
    });

    const accessToken = this._tokenService.generateAccessToken(
      user.id,
      user.role
    );
    const refreshToken = this._tokenService.generateRefreshToken(
      user.id,
      user.role
    );
    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string, role: "admin" | "user") {
    const repository =
      role === "admin" ? this.adminRepository : this.userRepository;
    const decoded = this._tokenService.verifyRefreshToken(refreshToken);
    const user = (await repository.findById(decoded.id)) || "";
    if (!user || user.role !== role) {
      throw new Error("Invalid refresh token");
    }
    const accessToken = this._tokenService.generateAccessToken(
      user.id,
      user.role
    );
    return { accessToken };
  }

  async logout(refreshToken: string) {
    const decoded = this._tokenService.verifyRefreshToken(refreshToken);
    console.log("decodedd", decoded);
    if (!decoded) {
      throw new Error("Invalid refresh token");
    }
    console.log("Logout request for user:", decoded.id, decoded.role);
  }

  async loginWithGoogle(googleToken: string, role: "user" | "mentor") {
    this._validationService.validateGoogleLoginInput({
      role,
      endpoint: "user",
    });
    const ticket = await this._googleVerificationService.verify(googleToken);
    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new Error("Google login failed: No email found");
    }

    let repository: UserRepository | MentorRepository;
    if (role === "mentor") {
      repository = this.mentorRepository;
    } else if (role === "user") {
      repository = this.userRepository;
    } else {
      throw new Error("invalid role");
    }

    let account = await repository.findByEmail(payload.email);
    if (!account) {
      account = await repository.create({
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
}
