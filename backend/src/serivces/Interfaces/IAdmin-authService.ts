import { LoginRequestDto } from '@/dto/request.dto';
import { AdminLoginRespondseDto } from '@/dto/response.dto';

export interface IAdminAuthService {
    adminLogin(login: LoginRequestDto): Promise<AdminLoginRespondseDto>;
}
