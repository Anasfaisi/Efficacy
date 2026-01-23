import { TYPES } from '@/config/inversify-key.types';
import { IAdmin } from '@/models/Admin.model';
import { IAdminRepository } from '@/repositories/interfaces/IAdmin.repository';
import { inject, injectable } from 'inversify';
import { IAdminAuthService } from './Interfaces/IAdmin-authService';
import { LoginRequestDto } from '@/Dto/request.dto';
import { AdminLoginRespondseDto } from '@/Dto/response.dto';
import { ErrorMessages } from '@/types/response-messages.types';
import { ITokenService } from './Interfaces/IToken.service';
import { IPasswordService } from './Interfaces/IPassword.service';

@injectable()
export class AdminAuthService implements IAdminAuthService {
    constructor(
        @inject(TYPES.AdminRepository)
        private _adminRepository: IAdminRepository<IAdmin>,
        @inject(TYPES.PasswordService)
        private _passwordService: IPasswordService,
        @inject(TYPES.TokenService) private _tokenService: ITokenService
    ) {}

    async adminLogin(login: LoginRequestDto): Promise<AdminLoginRespondseDto> {
        console.log('from admin service');
        const admin = await this._adminRepository.findByEmail(login.email);
        console.log(admin, 'form service');
        if (!admin) throw new Error(ErrorMessages.NoAdmin);

        const isMatch = await this._passwordService.verifyPassword(
            login.password,
            admin.password
        );
        if (!isMatch) throw new Error(ErrorMessages.InvalidCredentials);
        const accessToken = this._tokenService.generateAccessToken(
            admin.id,
            admin.role
        );

        const refreshToken = this._tokenService.generateRefreshToken(
            admin.id,
            admin.role
        );
        return new AdminLoginRespondseDto(
            {
                id: admin.id,
                email: admin.email,
                role: admin.role,
            },
            accessToken,
            refreshToken
        );
    }
}
