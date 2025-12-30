export type NotificationType = 'mentor' | 'system';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    timestamp: string;
    isRead: boolean;
    link?: string; // e.g. /admin/mentors/review/:id
}

export interface MentorApplication {
    id: string;
    name: string;
    email: string;
    bio: string;
    skills: string[];
    experienceYears: number;
    documents: {
        resume: string;
        certificate: string;
        idProof: string;
    };
    availability: {
        days: string;
        time: string;
    };
    videoLink?: string;
    status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
    submittedAt: string;
}
