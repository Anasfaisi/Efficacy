import { TYPES } from '@/config/inversify-key.types';
import { IAdmin } from '@/models/Admin.model';
import { IAdminRepository } from '@/repositories/interfaces/IAdmin.repository';
import { inject, injectable } from 'inversify';
import { IAdminAuthService } from './Interfaces/IAdmin-authService';
import { LoginRequestDto } from '@/Dto/request.dto';
import { AdminLoginRespondseDto } from '@/Dto/response.dto';
import { ErrorMessages } from '@/types/response-messages.types';
import { ref } from 'process';
import { ITokenService } from './Interfaces/IToken.service';

@injectable()
export class AdminAuthService implements IAdminAuthService {
    constructor(
        @inject(TYPES.AdminRepository)
        private _adminRepository: IAdminRepository<IAdmin>,
        @inject(TYPES.TokenService) private _tokenService: ITokenService
    ) {}
    
    async adminLogin(login: LoginRequestDto): Promise<AdminLoginRespondseDto> {
        console.log('from admin service');
        const admin = await this._adminRepository.findByEmail(login.email);
        console.log(admin,"form service")
        if (!admin) throw new Error(ErrorMessages.NoAdmin);

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
