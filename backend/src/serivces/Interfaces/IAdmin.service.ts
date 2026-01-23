import { MentorApplicationResponseDto } from '@/Dto/mentorResponse.dto';
import { PaginatedUserResponseDto } from '@/Dto/response.dto';
import { UpdateUserStatusRequestDto } from '@/Dto/request.dto';
import { ITransaction } from '@/models/Wallet.model';

export interface IAdminService {
    getMentorApplications(): Promise<MentorApplicationResponseDto[]>;
    getMentorApplicationById(
        id: string
    ): Promise<MentorApplicationResponseDto | null>;

    approveMentorApplication(id: string): Promise<void>;
    rejectMentorApplication(id: string, reason: string): Promise<void>;
    requestChangesMentorApplication(id: string, reason: string): Promise<void>;
    getAllMentors(): Promise<MentorApplicationResponseDto[]>;
    getMentorById(id: string): Promise<MentorApplicationResponseDto | null>;
    updateMentorStatus(id: string, status: string): Promise<void>;
    getAllUsers(
        page: number,
        limit: number,
        search?: string
    ): Promise<PaginatedUserResponseDto>;
    updateUserStatus(dto: UpdateUserStatusRequestDto): Promise<void>;
    getRevenueDetails(adminId: string): Promise<{ totalRevenue: number }>;
    getAllTransactions(
        page: number,
        limit: number,
        filter: 'all' | 'mentor' | 'user'
    ): Promise<{ transactions: ITransaction[]; total: number }>;
}
