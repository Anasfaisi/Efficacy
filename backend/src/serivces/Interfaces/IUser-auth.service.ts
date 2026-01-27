import { LoginResponseDTO } from "@/Dto/response.dto";

export interface IUserAuthService {
    login(email: string, password: string): Promise<LoginResponseDTO>;
}
