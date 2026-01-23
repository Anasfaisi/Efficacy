import { LoginRequestDto } from '@/Dto/request.dto';
import { AdminLoginRespondseDto } from '@/Dto/response.dto';

export interface IAdminAuthService {
    adminLogin(login: LoginRequestDto): Promise<AdminLoginRespondseDto>;
}
