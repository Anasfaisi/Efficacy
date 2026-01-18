export type NotificationType = 
    | 'mentor_application' 
    | 'system' 
    | 'mentor'
    | 'mentorship_request'
    | 'mentorship_response'
    | 'mentorship_active'
    | 'mentorship_completed';

export interface Notification {
    _id: string;
    recipientId: string;
    recipientRole: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, unknown>;
    isRead: boolean;
    createdAt: string;
}

export interface MentorApplication {
    _id: string;
    id: string;

    name: string;
    email: string;
    role: string;
    status: 'pending' | 'approved' | 'rejected' | 'changes_requested';

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

    mentorType: 'Academic' | 'Industry';
    demoVideoLink?: string;

    linkedin?: string;
    github?: string;
    personalWebsite?: string;

    domain?: string;
    academicSpan?: string;

    industryCategory?: string;
    currentRole?: string;
    guidanceAreas?: string[];
    createdAt: string;
}
