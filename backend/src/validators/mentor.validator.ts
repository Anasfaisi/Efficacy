import { z } from 'zod';

export const mentorApplicationSchema = z.object({
    name: z.string().min(3, "Full name must be at least 3 characters long"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    bio: z.string().min(10, "Bio must be at least 10 characters long"),
    publicProfile: z.string().url("Public profile must be a valid URL"),

    qualification: z.string().min(1, "Highest qualification is required"),
    university: z.string().min(1, "University is required"),
    graduationYear: z.string().regex(/^\d{4}$/, "Graduation year must be a valid year"),

    experienceYears: z.coerce.number().min(0, "Experience years cannot be negative"),
    skills: z.string().min(1, "Skills are required"),
    experienceSummary: z.string().min(10, "Experience summary must be at least 10 characters"),

    availableDays: z.string().min(1, "Available days are required"),
    preferredTime: z.string().min(1, "Preferred time is required"),
    sessionsPerWeek: z.coerce.number().min(1, "Sessions per week must be at least 1"),
});

export type MentorApplicationInput = z.infer<typeof mentorApplicationSchema>;
