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
            status: 'pending',

            linkedin: dto.linkedin,
            github: dto.github,
            personalWebsite: dto.personalWebsite,
            demoVideoLink: dto.demoVideoLink,

            availableDays: dto.availableDays,
            preferredTime: dto.preferredTime,

            mentorType: dto.mentorType,

            // Academic Branch
            qualification: dto.qualification,
            domain: dto.domain,
            university: dto.university,
            graduationYear: dto.graduationYear,
            expertise: dto.expertise,
            academicSpan: dto.academicSpan,

            // Industry Branch
            industryCategory: dto.industryCategory,
            experienceYears: dto.experienceYears,
            currentRole: dto.currentRole,
            skills: dto.skills,
            guidanceAreas: dto.guidanceAreas,
            experienceSummary: dto.experienceSummary,

            resume: dto.resume,
            certificate: dto.certificate,
            idProof: dto.idProof,
        };
        console.log(updateData, "updated data from mentor onboard service")


        const updatedMentorDoc = await this._mentorRepository.update(mentor.id, updateData);
        if (!updatedMentorDoc) {
            throw new Error('could not able to update mentor doc');
        }
        return {
            email: updatedMentorDoc.email,
            name: updatedMentorDoc.name,
            phone: updatedMentorDoc.phone,
            city: updatedMentorDoc.city || '',
            state: updatedMentorDoc.state || '',
            country: updatedMentorDoc.country || '',
            bio: updatedMentorDoc.bio || '',
            status: updatedMentorDoc.status,

            linkedin: updatedMentorDoc.linkedin,
            github: updatedMentorDoc.github,
            personalWebsite: updatedMentorDoc.personalWebsite,
            demoVideoLink: updatedMentorDoc.demoVideoLink,

            availableDays: updatedMentorDoc.availableDays || [],
            preferredTime: updatedMentorDoc.preferredTime || [],

            mentorType: updatedMentorDoc.mentorType!,

            // Academic Branch
            qualification: updatedMentorDoc.qualification,
            domain: updatedMentorDoc.domain,
            university: updatedMentorDoc.university,
            graduationYear: updatedMentorDoc.graduationYear,
            expertise: updatedMentorDoc.expertise,
            academicSpan: updatedMentorDoc.academicSpan,

            // Industry Branch
            industryCategory: updatedMentorDoc.industryCategory,
            experienceYears: updatedMentorDoc.experienceYears,
            currentRole: updatedMentorDoc.currentRole,
            skills: updatedMentorDoc.skills,
            guidanceAreas: updatedMentorDoc.guidanceAreas,
            experienceSummary: updatedMentorDoc.experienceSummary,

            resume: updatedMentorDoc.resume,
            certificate: updatedMentorDoc.certificate,
            idProof: updatedMentorDoc.idProof,
        };
    }
}

// have mapped to an object similar type of MentorResponseDto
