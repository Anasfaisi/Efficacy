import { injectable, inject } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IMentorService } from './Interfaces/IMentor.service';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { IPasswordService } from './Interfaces/IPassword.service';
import { IMentor } from '@/models/Mentor.model';
import { UpdateMentorProfileDto } from '@/Dto/mentorRequest.dto';
import { ErrorMessages } from '@/types/response-messages.types';

@injectable()
export class MentorService implements IMentorService {
    constructor(
        @inject(TYPES.MentorRepository)
        private _mentorRepository: IMentorRepository,
        @inject(TYPES.PasswordService) private _passwordService: IPasswordService
    ) {}

    async getMentorProfile(id: string): Promise<IMentor> {
        const mentor = await this._mentorRepository.findById(id);
        if (!mentor) throw new Error('Mentor not found');
        return mentor;
    }

    async updateMentorProfileBasicInfo(id: string, data: UpdateMentorProfileDto): Promise<IMentor> {
        const updateData: Partial<IMentor> & { currentPassword?: string; newPassword?: string } = { ...data };

        if (updateData.newPassword && updateData.currentPassword) {
            const mentor = await this._mentorRepository.findById(id);
            if (!mentor || !mentor.password) throw new Error('Mentor details not found');

            const isMatch = await this._passwordService.verifyPassword(updateData.currentPassword, mentor.password);
            if (!isMatch) throw new Error('Current password is incorrect');

            updateData.password = await this._passwordService.hashPassword(updateData.newPassword);
        }

        // Clean up temporary fields
        delete updateData.currentPassword;
        delete updateData.newPassword;

        const updatedMentor = await this._mentorRepository.update(id, updateData);
        if (!updatedMentor) throw new Error(ErrorMessages.UpdateFailed);
        return updatedMentor;
    }

    async updateMentorProfileMedia(id: string, files: any): Promise<IMentor> {
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const updateData: Partial<IMentor> = {};

        if (files.profilePic) {
            updateData.profilePic = `${baseUrl}/uploads/${files.profilePic[0].filename}`;
        }
        if (files.coverPic) {
            updateData.coverPic = `${baseUrl}/uploads/${files.coverPic[0].filename}`;
        }
        if (files.resume) {
            updateData.resume = `${baseUrl}/uploads/${files.resume[0].filename}`;
        }
        if (files.certificate) {
            updateData.certificate = `${baseUrl}/uploads/${files.certificate[0].filename}`;
        }
        if (files.idProof) {
            updateData.idProof = `${baseUrl}/uploads/${files.idProof[0].filename}`;
        }

        const updated = await this._mentorRepository.update(id, updateData);
        if (!updated) throw new Error(ErrorMessages.UpdateFailed);
        return updated;
    }

    async updateMentorProfileArray(id: string, field: string, data: any[]): Promise<IMentor> {
        const updateData: any = {};
        updateData[field] = data;
        const updated = await this._mentorRepository.update(id, updateData);
        if (!updated) throw new Error(ErrorMessages.UpdateFailed);
        return updated;
    }

    async getApprovedMentors(
        page: number,
        limit: number,
        search: string,
        sort: string,
        filter: any
    ): Promise<{ mentors: IMentor[]; total: number; pages: number }> {
        const mentorsList = await this._mentorRepository.findAllApprovedMentors(
            page,
            limit,
            search,
            sort,
            filter
        );
        console.log(mentorsList,"mentorsList")
        return mentorsList
    }
}
