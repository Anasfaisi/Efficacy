import type { Mentor } from '@/types/auth';
import { MentorshipStatus } from '@/types/mentorship';

export enum Priority {
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low',
}

export interface ISubtask {
    _id?: string;
    title: string;
    completed: boolean;
}

export interface IPlannerTask {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    priority: Priority;
    startDate: string;
    endDate: string;
    subtasks: ISubtask[];
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TimeContextType {
    currentTime: Date;
}

export interface Mentorshiptype {
    _id: string;
    userId: string;
    mentorId: Mentor;
    status: MentorshipStatus;
    startDate?: string;
    endDate?: string;
    proposedStartDate?: string;
    proposedEndDate?: string;
    usedSessions?: number;
    totalSessions?: number;
    createdAt: string;
    updatedAt: string;
}
