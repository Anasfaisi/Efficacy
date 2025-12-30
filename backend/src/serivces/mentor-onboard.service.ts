import { injectable, inject } from 'inversify';
import { IMentorOnboardService } from './Interfaces/IMentor-onboard.service';
import { MentorApplicationRequestDto } from '@/Dto/mentorRequest.dto';
import { IMentor } from '@/models/Mentor.model';
import { TYPES } from '@/config/inversify-key.types';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { MentorApplicationResponseDto } from '@/Dto/mentorResponse.dto';

@injectable()
export class MentorOnboardService implements IMentorOnboardService {
    constructor(
        @inject(TYPES.MentorRepository)
        private _mentorRepository: IMentorRepository
    ) { }

    async mentorApplicationInit(
        dto: MentorApplicationRequestDto
    ): Promise<MentorApplicationResponseDto | null> {
        //didn't mapped to domain entity due to zero value for domain
        const mentor = await this._mentorRepository.findById(dto.id);
        if (!mentor) {
            throw new Error('Mentor not found');
        }


        const updateData: Partial<IMentor> = {
            name: dto.name,
            phone: dto.phone,
            city: dto.city,
            state: dto.state,
            country: dto.country,
            bio: dto.bio,
            publicProfile: dto.publicProfile,
            status: 'pending',
            qualification: dto.qualification,
            university: dto.university,
            graduationYear: dto.graduationYear,
            experienceYears: dto.experienceYears,
            skills: dto.skills,
            experienceSummary: dto.experienceSummary,
            availableDays: dto.availableDays,
            preferredTime: dto.preferredTime,
            sessionsPerWeek: dto.sessionsPerWeek,
            resume: dto.resume,
            certificate: dto.certificate,
            idProof: dto.idProof
        };
        console.log(updateData, "updated data from mentor onboard service")


        const updatedMentorDoc = await this._mentorRepository.update(mentor.id, updateData);
        if (!updatedMentorDoc) {
            throw new Error('could not able to update mentor doc');
        }
        return {
            email: updatedMentorDoc.email,
            name: updatedMentorDoc.name,
            city: updatedMentorDoc.city || '',
            state: updatedMentorDoc.state || '',
            country: updatedMentorDoc.country || '',
            bio: updatedMentorDoc.bio || '',
            publicProfile: updatedMentorDoc.publicProfile || '',
            qualification: updatedMentorDoc.qualification || '',
            university: updatedMentorDoc.university || '',
            graduationYear: updatedMentorDoc.graduationYear || '',
            experienceYears: updatedMentorDoc.experienceYears || '',
            skills: updatedMentorDoc.skills || '',
            experienceSummary: updatedMentorDoc.experienceSummary || '',
            availableDays: updatedMentorDoc.availableDays || '',
            preferredTime: updatedMentorDoc.preferredTime || '',
            sessionsPerWeek: updatedMentorDoc.sessionsPerWeek || '',
            resume: updatedMentorDoc.resume,
            certificate: updatedMentorDoc.certificate,
            idProof: updatedMentorDoc.idProof,
            status: updatedMentorDoc.status
        };
    }
}

// have mapped to an object similar type of MentorResponseDto
