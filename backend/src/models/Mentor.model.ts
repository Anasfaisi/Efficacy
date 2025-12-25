import { Schema, model, Document, ObjectId } from 'mongoose';

interface IMentor extends Document<ObjectId> {
    fullName: string;
    email: string;
    password: string;
    role: string;

    phone?: string;
    city?: string;
    state?: string;
    country?: string;
    bio?: string;
    profilePic?: string;
    publicProfile?: string;
    status?: string;

    qualification?: string;
    university?: string;
    graduationYear?: string;

    experienceYears?: string;
    skills?: string;
    experienceSummary?: string;

    availableDays?: string;
    preferredTime?: string;
    sessionsPerWeek?: string;

    resume?: string;
    certificate?: string;
    idProof?: string;

    isVerified?: boolean;
    expertise?: string;
}

const mentorSchema = new Schema<IMentor>({
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'mentor' },

    // Basic Details
    phone: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    bio: { type: String },
    profilePic: { type: String },
    publicProfile: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

    // Education
    qualification: { type: String },
    university: { type: String },
    graduationYear: { type: String },

    // Experience
    experienceYears: { type: String },
    skills: { type: String },
    experienceSummary: { type: String },

    // Availability
    availableDays: { type: String },
    preferredTime: { type: String },
    sessionsPerWeek: { type: String },

    // Documents
    resume: { type: String },
    certificate: { type: String },
    idProof: { type: String },

    isVerified: { type: Boolean, default: false },
    expertise: { type: String },
});

export { IMentor };
export default model<IMentor>('Mentors', mentorSchema);
