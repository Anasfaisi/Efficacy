"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorMapper = void 0;
const mentor_entity_1 = require("@/entity/mentor.entity");
class MentorMapper {
    static toEntity(doc) {
        if (!doc) {
            throw new Error('Mentor not found');
        }
        const d = doc;
        return new mentor_entity_1.MentorEntity(d._id?.toString() || d.id?.toString(), d.name, d.email, d.role, d.status, d.phone, d.city, d.state, d.country, d.bio, d.profilePic, d.coverPic, d.publicProfile, d.qualification, d.university, d.graduationYear, d.experienceYears, d.skills, d.experienceSummary, d.availability, d.resume, d.certificate, d.idProof, d.isVerified, d.expertise, d.mentorType, d.demoVideoLink, d.linkedin, d.github, d.personalWebsite, d.domain, d.academicSpan, d.industryCategory, d.currentRole, d.guidanceAreas, d.monthlyCharge, d.achievements, d.extraSkills, d.rating, d.reviewCount, d.sessionsCompleted, d.applicationFeedback, d.createdAt, d.updatedAt);
    }
}
exports.MentorMapper = MentorMapper;
//# sourceMappingURL=mentor.mapper.js.map