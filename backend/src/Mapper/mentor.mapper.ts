import { IMentor } from "@/models/Mentor.model";
import { MentorEntity } from "@/entity/mentor.entity";
import { Types } from "mongoose";

export class MentorMapper {
    static toEntity(doc: IMentor): MentorEntity {
        const d = doc as any;
        return new MentorEntity(
            d._id?.toString() || d.id?.toString(),
            d.name,
            d.email,
            d.role,
            d.status,
            d.phone,
            d.city,
            d.state,
            d.country,
            d.bio,
            d.profilePic,
            d.coverPic,
            d.publicProfile,
            d.qualification,
            d.university,
            d.graduationYear,
            d.experienceYears,
            d.skills,
            d.experienceSummary,
            d.availableDays,
            d.preferredTime,
            d.resume,
            d.certificate,
            d.idProof,
            d.isVerified,
            d.expertise,
            d.mentorType,
            d.demoVideoLink,
            d.linkedin,
            d.github,
            d.personalWebsite,
            d.domain,
            d.academicSpan,
            d.industryCategory,
            d.currentRole,
            d.guidanceAreas,
            d.monthlyCharge,
            d.achievements,
            d.extraSkills,
            d.rating,
            d.reviewCount,
            d.sessionsCompleted,
            d.applicationFeedback,
            d.createdAt,
            d.updatedAt
        );
    }

    static toPersistence(entity: Partial<MentorEntity>): any {
        const persistence: any = { ...entity };
        if (entity.id) {
            persistence._id = new Types.ObjectId(entity.id);
            delete persistence.id;
        }
        return persistence;
    }
}
