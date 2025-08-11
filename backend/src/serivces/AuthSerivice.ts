import { UserRepository } from "../repositories/UserRepository";
import { MentorRepository } from "@/repositories/mentorRepository";
import { AdminRepository } from "@/repositories/adminRepository";
import { TokenService } from "./TokenService";
import { injectable, inject } from "inversify";
import { TYPES } from "@/types";
import bcrypt from "bcrypt";
import { GoogleVerificationService } from "./GoogleVerificationService";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.AdminRepository) private adminRepository: AdminRepository,
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.MentorRepository) private mentorRepository: MentorRepository,
    @inject(TYPES.TokenService) private tokenService: TokenService,
    @inject(TYPES.GoogleVerificationService)
    private googleVerificationService: GoogleVerificationService
  ) {}

  async login(
    email: string,
    password: string,
    role: "admin" | "user" | "mentor"
  ) {
    let repository: AdminRepository | UserRepository | MentorRepository;
    switch (role) {
      case "admin":
        repository = this.adminRepository;
        break;
      case "mentor":
        repository = this.mentorRepository;
        break;

      case "user":
        repository = this.userRepository;
        break;
      default:
        throw new Error("Invalid role");
    }
    const account = await repository.findByEmail(email);
    if (!account || account.role !== role) {
      throw new Error(`Not authorized as ${role}`);
    }
    if (!(await bcrypt.compare(password, account.password))) {
      throw new Error("Invalid email or password");
    }
    const accessToken = this.tokenService.generateAccessToken(
      account.id,
      account.role
    );
    const refreshToken = this.tokenService.generateRefreshToken(
      account.id,
      account.role
    );
    return {
      accessToken,
      refreshToken,
      user: {
        id: account.id,
        email: account.email,
        name: account.name,
        role: account.role,
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
    let repository;

    if (role === "mentor") {
      repository = this.mentorRepository;
    } else {
      repository = this.userRepository;
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

    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user.role
    );
    const refreshToken = this.tokenService.generateRefreshToken(
      user.id,
      user.role
    );
    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string, role: "admin" | "user") {
    const repository =
      role === "admin" ? this.adminRepository : this.userRepository;
    const decoded = this.tokenService.verifyRefreshToken(refreshToken);
    const user = (await repository.findById(decoded.id)) || "";
    if (!user || user.role !== role) {
      throw new Error("Invalid refresh token");
    }
    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user.role
    );
    return { accessToken };
  }

  async logout(refreshToken: string) {
    try {
      const decoded = this.tokenService.verifyRefreshToken(refreshToken);
      console.log("Logout request for user:", decoded.id, decoded.role);
    } catch {
      console.warn("Invalid refresh token during logout");
    }
  }

  async loginWithGoogle(googleToken: string, role: "user" | "mentor") {
    const ticket = await this.googleVerificationService.verify(googleToken);
    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new Error("Google login failed: No email found");
    }

    let repository: UserRepository | MentorRepository;
    switch (role) {
      case "mentor":
        repository = this.mentorRepository;
        break;
      case "user":
        repository = this.userRepository;
        break;
      default:
        throw new Error("Invalid role for Google login");
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

    const accessToken = this.tokenService.generateAccessToken(
      account!.id,
      account!.role
    );
    const refreshToken = this.tokenService.generateRefreshToken(
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

  // async loginUser(email: string, password: string) {
  //   const user = await this.userRepository.findByEmail(email);
  //   if (!user || user.role !== "user") {
  //     throw new Error("Not authorized as user");
  //   }
  //   if (!(await bcrypt.compare(password, user.password))) {
  //     throw new Error("Invalid email or password");
  //   }
  //   const accessToken = this.tokenService.generateAccessToken(
  //     user.id,
  //     user.role
  //   );
  //   const refreshToken = this.tokenService.generateRefreshToken(
  //     user.id,
  //     user.role
  //   );
  //   await this.userRepository.updateRefreshToken(user.id, refreshToken);
  //   return {
  //     accessToken,
  //     refreshToken,
  //     user: {
  //       id: user.id,
  //       email: user.email,
  //       name: user.name,
  //       role: user.role,
  //     },
  //   };
  // }
}
