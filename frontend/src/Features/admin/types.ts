export type NotificationType = 'mentor_application' | 'system' | 'mentor';

export interface Notification {
  _id: string; // MongoDB ID
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

  // New onboarding fields
  mentorType: 'Academic' | 'Industry';
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
  createdAt: string;
}
