import { inject, injectable } from 'inversify';
import { IUserRepository } from '@/repositories/interfaces/IUser.repository';
import { TYPES } from '@/config/inversify-key.types';
import { IPasswordService } from './Interfaces/IPassword.service';
import { IUserAuthService } from './Interfaces/IUser-auth.service';
import { LoginResponseDTO } from '@/Dto/response.dto';
import { Role } from '@/types/role.types';
import { ITokenService } from './Interfaces/IToken.service';

@injectable()
export class UserAuthService implements IUserAuthService {
    constructor(
        @inject(TYPES.UserRepository)
        private _userRepository: IUserRepository,
        @inject(TYPES.PasswordService)
        private _passwordService: IPasswordService,
        @inject(TYPES.TokenService)
        private _tokenService: ITokenService
    ) {}

    async login(email: string, password: string): Promise<LoginResponseDTO> {
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.password) {
            throw new Error('User password not found');
        }
        const isPasswordValid = await this._passwordService.comparePassword(
            password,
            user.password
        );
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
           const accessToken = this._tokenService.generateAccessToken(
            user.id,
            user.role
        );
        const refreshToken = this._tokenService.generateRefreshToken(
            user.id,
            user.role
        );
        return new LoginResponseDTO(accessToken, refreshToken, {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role as Role,
                    subscription: user?.subscription,
                    bio: user?.bio,
                    headline: user?.headline,
                    profilePic: user?.profilePic,
                    dob: user?.dob,
                    xpPoints: user.xpPoints,
                    badge: user?.badge,
                });
    }
}
