import { injectable, inject } from 'inversify';
import { TYPES } from '@/config/inversify-key.types';
import { IMentorService } from './Interfaces/IMentor.service';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { IPasswordService } from './Interfaces/IPassword.service';
import { IMentor } from '@/models/mentor.model';
import { UpdateMentorProfileDto } from '@/dto/mentorRequest.dto';
import { ErrorMessages } from '@/types/response-messages.types';

@injectable()
export class MentorService implements IMentorService {
    constructor(
        @inject(TYPES.MentorRepository)
        private _mentorRepository: IMentorRepository,
        @inject(TYPES.PasswordService)
        private _passwordService: IPasswordService
    ) {}

    async getMentorProfile(id: string): Promise<IMentor> {
        const mentor = await this._mentorRepository.findById(id);
        if (!mentor) throw new Error(ErrorMessages.MentorNotFound);
        return mentor;
    }

    async updateMentorProfileBasicInfo(
        id: string,
        data: UpdateMentorProfileDto
    ): Promise<IMentor> {
        const updateData: Partial<IMentor> & {
            currentPassword?: string;
            newPassword?: string;
        } = { ...data };

        if (updateData.newPassword && updateData.currentPassword) {
            const mentor = await this._mentorRepository.findById(id);
            if (!mentor || !mentor.password)
                throw new Error(ErrorMessages.UserNotFound);

            const isMatch = await this._passwordService.verifyPassword(
                updateData.currentPassword,
                mentor.password
            );
            if (!isMatch) throw new Error(ErrorMessages.IncorrectPassword);

            updateData.password = await this._passwordService.hashPassword(
                updateData.newPassword
            );
        }

        delete updateData.currentPassword;
        delete updateData.newPassword;

        const updatedMentor = await this._mentorRepository.update(
            id,
            updateData
        );
        if (!updatedMentor) throw new Error(ErrorMessages.UpdateFailed);
        return updatedMentor;
    }

    async updateMentorProfileMedia(id: string, files: {[fieldName:string] : (Express.Multer.File & { location: string })[]}): Promise<IMentor> {
        const updateData: Partial<IMentor> = {};

        if (files.profilePic) {
            updateData.profilePic = `${files.profilePic[0].location}`;
        }
        if (files.coverPic) {
            updateData.coverPic = `${files.coverPic[0].location}`;
        }
        if (files.resume) {
            updateData.resume = `${files.resume[0].location}`;
        }
        if (files.certificate) {
            updateData.certificate = `${files.certificate[0].location}`;
        }
        if (files.idProof) {
            updateData.idProof = `${files.idProof[0].location}`;
        }

        const updated = await this._mentorRepository.update(id, updateData);
        if (!updated) throw new Error(ErrorMessages.UpdateFailed);
        return updated;
    }

    async updateMentorProfileArray(
        id: string,
        field: string,
        data: string[]
    ): Promise<IMentor> {
        const updateData:Record<string,string[]> = {};
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
        filter: {
            expertise?: { $regex: string; $options: string };
            monthlyCharge?: { $gte?: number; $lte?: number };
            rating?: { $gte: number };
        }
    ): Promise<{ mentors: IMentor[]; total: number; pages: number }> {
        const mentorsList = await this._mentorRepository.findAllApprovedMentors(
            page,
            limit,
            search,
            sort,
            filter
        );
        return mentorsList;
    }

    async getMentorById(id: string): Promise<IMentor | null> {
        return await this._mentorRepository.findById(id);
    }
}
