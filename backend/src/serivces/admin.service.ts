import { injectable, inject } from 'inversify';
import { IAdminService } from './Interfaces/IAdmin.service';
import { MentorApplicationResponseDto } from '@/Dto/mentorResponse.dto';
import { IMentor } from '@/models/Mentor.model';
import { TYPES } from '@/config/inversify-key.types';
import { IMentorRepository } from '@/repositories/interfaces/IMentor.repository';
import { INotificationService } from './Interfaces/INotification.service';
import { NotificationType } from '@/types/notification.enum';
import { Role } from '@/types/role.types';

@injectable()
export class AdminService implements IAdminService {
    constructor(
        @inject(TYPES.MentorRepository)
        private _mentorRepository: IMentorRepository,
        @inject(TYPES.NotificationService)
        private _notificationService: INotificationService
    ) {}

    private mapToResponseDto(mentor: IMentor): MentorApplicationResponseDto {
        return {
            id: mentor.id,
            _id: mentor.id,
            email: mentor.email,
            name: mentor.name,
            phone: mentor.phone,
            city: mentor.city || '',
            state: mentor.state || '',
            country: mentor.country || '',
            bio: mentor.bio || '',
            createdAt: mentor.createdAt,
            status: mentor.status,

            linkedin: mentor.linkedin,
            github: mentor.github,
            personalWebsite: mentor.personalWebsite,
            demoVideoLink: mentor.demoVideoLink,
            availableDays: mentor.availableDays || [],
            preferredTime: mentor.preferredTime || [],
            mentorType: mentor.mentorType!,
            qualification: mentor.qualification,
            domain: mentor.domain,
            university: mentor.university,
            graduationYear: mentor.graduationYear,
            expertise: mentor.expertise,
            academicSpan: mentor.academicSpan,
            industryCategory: mentor.industryCategory,
            experienceYears: mentor.experienceYears,
            currentRole: mentor.currentRole,
            skills: mentor.skills,
            guidanceAreas: mentor.guidanceAreas,
            experienceSummary: mentor.experienceSummary,
            resume: mentor.resume,
            certificate: mentor.certificate,
            idProof: mentor.idProof
        };
    }

    async getMentorApplications(): Promise<MentorApplicationResponseDto[]> {
        const mentors = await this._mentorRepository.find({ status: 'pending' });
        return mentors.map(m => this.mapToResponseDto(m));
    }

    async getMentorApplicationById(id: string): Promise<MentorApplicationResponseDto | null> {
        const mentor = await this._mentorRepository.findById(id);
        return mentor ? this.mapToResponseDto(mentor) : null;
    }


    async approveMentorApplication(id: string): Promise<void> {
        const mentor = await this._mentorRepository.update(id, { status: 'approved', isVerified: true });
        if (mentor) {
            await this._notificationService.createNotification(
                mentor.id,
                Role.Mentor as any,
                NotificationType.MENTOR_APPLICATION_APPROVED,
                'Application Approved',
                'Congratulations! Your mentor application has been approved. You can now access the mentor dashboard.',
                { link: '/mentor/dashboard' }
            );
        }
    }

    async rejectMentorApplication(id: string, reason: string): Promise<void> {
        const mentor = await this._mentorRepository.update(id, { status: 'rejected' });
        if (mentor) {
            await this._notificationService.createNotification(
                mentor.id,
                Role.Mentor as any,
                NotificationType.MENTOR_APPLICATION_REJECTED,
                'Application Rejected',
                `Your mentor application has been rejected. Reason: ${reason}`,
                { reason }
            );
        }
    }

    async requestChangesMentorApplication(id: string, reason: string): Promise<void> {
        const mentor = await this._mentorRepository.update(id, { status: 'incomplete' }); // Or a new status like 'changes_requested'
        if (mentor) {
            await this._notificationService.createNotification(
                mentor.id,
                Role.Mentor as any,
                NotificationType.SYSTEM_ANNOUNCEMENT, // Maybe use a more specific type if available
                'Changes Requested',
                `The admin has requested changes to your application. Reason: ${reason}`,
                { reason, link: '/mentor/onboarding' }
            );
        }
    }
}
