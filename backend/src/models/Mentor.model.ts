import { Schema, model, Document, ObjectId } from 'mongoose';

interface IMentor extends Document<ObjectId> {
    name: string;
    email: string;
    password?: string;
    role: string;
    status: string;

    phone?: string;
    city?: string;
    state?: string;
    country?: string;
    bio?: string;
    profilePic?: string;
    publicProfile?: string;

    qualification?: string;
    university?: string;
    graduationYear?: string;

    experienceYears?: string;
    skills?: string;
    experienceSummary?: string;

    availableDays?: string[];
    preferredTime?: string[];

    resume?: string;
    certificate?: string;
    idProof?: string;

    isVerified?: boolean;
    expertise?: string;

    // New onboarding fields
    mentorType?: 'Academic' | 'Industry';
    demoVideoLink?: string;

    // Socials
    linkedin?: string;
    github?: string;
    personalWebsite?: string;

    // Academic Branch
    domain?: string;
    academicSpan?: string;

    // Industry Branch
    industryCategory?: string;
    currentRole?: string;
    guidanceAreas?: string[];

    createdAt?: Date;
    updatedAt?: Date;
}

const mentorSchema = new Schema<IMentor>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: false },
    role: { type: String, default: 'mentor' },

    // Basic Details
    phone: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    bio: { type: String },
    profilePic: { type: String },
    publicProfile: { type: String }, // This might be used as "Portfolio URL" or similar now
    status: { type: String, enum: ['incomplete', 'pending', 'approved', 'rejected'], default: 'incomplete' },

    // Education
    qualification: { type: String },
    university: { type: String },
    graduationYear: { type: String },

    // Experience (General)
    experienceYears: { type: String },
    skills: { type: String },
    experienceSummary: { type: String },

    // Availability
    availableDays: { type: [String] },
    preferredTime: { type: [String] },

    // Documents
    resume: { type: String },
    certificate: { type: String },
    idProof: { type: String },

    isVerified: { type: Boolean, default: false },
    expertise: { type: String },

    // New Onboarding Fields
    mentorType: { type: String, enum: ['Academic', 'Industry'] },
    demoVideoLink: { type: String },

    // Socials
    linkedin: { type: String },
    github: { type: String },
    personalWebsite: { type: String },

    // Academic Branch
    domain: { type: String },
    academicSpan: { type: String },

    // Industry Branch
    industryCategory: { type: String },
    currentRole: { type: String },
    guidanceAreas: { type: [String] },

}, { timestamps: true });

export { IMentor };
export default model<IMentor>('Mentors', mentorSchema);
