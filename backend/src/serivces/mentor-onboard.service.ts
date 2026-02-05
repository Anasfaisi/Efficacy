import { injectable, inject } from 'inversify';
import { IMentorOnboardService } from './Interfaces/IMentor-onboard.service';
import { MentorApplicationRequestDto } from '@/Dto/mentorRequest.dto';
import { IMentor } from '@/models/Mentor.model';
import { TYPES } from '@/config/inversify-key.types';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { MentorApplicationResponseDto } from '@/Dto/mentorResponse.dto';
import { INotificationService } from './Interfaces/INotification.service';
import { NotificationType } from '@/types/notification.enum';
import { ErrorMessages, NotificationMessages } from '@/types/response-messages.types';

@injectable()
export class MentorOnboardService implements IMentorOnboardService {
    constructor(
        @inject(TYPES.MentorRepository)
        private _mentorRepository: IMentorRepository,
        @inject(TYPES.NotificationService)
        private _notificationService: INotificationService
    ) {}

    async mentorApplicationInit(
        dto: MentorApplicationRequestDto
    ): Promise<MentorApplicationResponseDto | null> {
        const mentor = await this._mentorRepository.findById(dto.id);
        console.log(mentor, 'mentor from mentor onboard service');
        if (!mentor) {
            throw new Error(ErrorMessages.MentorNotFound);
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

            qualification: dto.qualification,
            domain: dto.domain,
            university: dto.university,
            graduationYear: dto.graduationYear,
            expertise: dto.expertise,
            academicSpan: dto.academicSpan,

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
        console.log(updateData, 'updated data from mentor onboard service');

        const updatedMentorDoc = await this._mentorRepository.update(
            mentor.id,
            updateData
        );
        if (!updatedMentorDoc) {
            throw new Error(ErrorMessages.MentorUpdateFailed);
        }

        await this._notificationService
            .notifyAdmin(
                NotificationType.MENTOR_APPLICATION_SUBMITTED,
                NotificationMessages.NewMentorAppTitle,
                `Mentor ${updatedMentorDoc.name} has submitted an application for review.`,
                {
                    mentorId: updatedMentorDoc.id,
                    link: `/admin/mentors/review/${updatedMentorDoc.id}`,
                }
            )
            .catch((err) =>
                console.error('Failed to send admin notification:', err)
            );

        return {
            id: updatedMentorDoc.id,
            _id: updatedMentorDoc.id,
            email: updatedMentorDoc.email,

            name: updatedMentorDoc.name,
            phone: updatedMentorDoc.phone,
            city: updatedMentorDoc.city || '',
            state: updatedMentorDoc.state || '',
            country: updatedMentorDoc.country || '',
            bio: updatedMentorDoc.bio || '',
            createdAt: updatedMentorDoc.createdAt,
            status: updatedMentorDoc.status,

            linkedin: updatedMentorDoc.linkedin,
            github: updatedMentorDoc.github,
            personalWebsite: updatedMentorDoc.personalWebsite,
            demoVideoLink: updatedMentorDoc.demoVideoLink,

            availableDays: updatedMentorDoc.availableDays || [],
            preferredTime: updatedMentorDoc.preferredTime || [],

            mentorType: updatedMentorDoc.mentorType!,

            qualification: updatedMentorDoc.qualification,
            domain: updatedMentorDoc.domain,
            university: updatedMentorDoc.university,
            graduationYear: updatedMentorDoc.graduationYear,
            expertise: updatedMentorDoc.expertise,
            academicSpan: updatedMentorDoc.academicSpan,

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

    async activateMentor(
        mentorId: string,
        monthlyCharge: number
    ): Promise<IMentor | null> {
        const mentor = await this._mentorRepository.findById(mentorId);
        if (!mentor) {
            throw new Error(ErrorMessages.MentorNotFound);
        }

        if (mentor.status !== 'approved') {
            throw new Error(ErrorMessages.MentorNotApproved);
        }

        return await this._mentorRepository.update(mentorId, {
            status: 'active',
            monthlyCharge,
        });
    }
}
