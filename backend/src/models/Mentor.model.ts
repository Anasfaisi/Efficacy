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
    coverPic?: string;
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

    mentorType?: 'Academic' | 'Industry';
    demoVideoLink?: string;

    linkedin?: string;
    github?: string;
    personalWebsite?: string;

    domain?: string;
    academicSpan?: string;

    industryCategory?: string;
    currentRole?: string;
    guidanceAreas?: string[];

    monthlyCharge?: number;
    achievements?: string[];
    extraSkills?: string[];
    rating?: number;
    reviewCount?: number;
    sessionsCompleted?: number;
    applicationFeedback?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

const mentorSchema = new Schema<IMentor>(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: false },
        role: { type: String, default: 'mentor' },

        phone: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        bio: { type: String },
        profilePic: { type: String },
        coverPic: { type: String },
        publicProfile: { type: String },
        status: {
            type: String,
            enum: ['incomplete', 'pending', 'approved', 'active', 'inactive', 'rejected', 'reapply'],
            default: 'incomplete',
        },

        qualification: { type: String },
        university: { type: String },
        graduationYear: { type: String },

        experienceYears: { type: String },
        skills: { type: String },
        experienceSummary: { type: String },

        availableDays: { type: [String] },
        preferredTime: { type: [String] },

        resume: { type: String },
        certificate: { type: String },
        idProof: { type: String },

        isVerified: { type: Boolean, default: false },
        expertise: { type: String },

        mentorType: { type: String, enum: ['Academic', 'Industry'] },
        demoVideoLink: { type: String },

        linkedin: { type: String },
        github: { type: String },
        personalWebsite: { type: String },

        domain: { type: String },
        academicSpan: { type: String },

        industryCategory: { type: String },
        currentRole: { type: String },
        guidanceAreas: { type: [String] },

        monthlyCharge: { type: Number, default: 0, min: 0, max: 2000 },
        achievements: { type: [String] },
        extraSkills: { type: [String] },
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        sessionsCompleted: { type: Number, default: 0 },
        applicationFeedback: { type: String },
    },
    //handle the _id and id (for exposing that)
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
    
);

export { IMentor };
export default model<IMentor>('Mentors', mentorSchema);
