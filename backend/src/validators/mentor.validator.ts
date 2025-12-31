import { z } from 'zod';

const jsonStringToArray = z.preprocess((val: unknown) => {
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        } catch {
            return val;
        }
    }
    return val;
}, z.array(z.string()));

export const mentorApplicationSchema = z
    .object({
        name: z.string().min(3, 'Name is too short'),
        phone: z.string().regex(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number'),
        city: z.string().min(3, 'City is required'),
        state: z.string().min(3, 'State is required'),
        country: z.string().min(3, 'Country is required'),
        bio: z.string().min(20, 'Bio must be at least 20 characters'),

        linkedin: z.string().url('Must be a valid URL'),
        github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
        personalWebsite: z
            .string()
            .url('Must be a valid URL')
            .optional()
            .or(z.literal('')),

        demoVideoLink: z.string().url('Must be a valid video URL (YouTube Unlisted/Drive)'),

        availableDays: jsonStringToArray.refine((arr: string[]) => arr.length >= 3, 'Select at least 3 days'),
        preferredTime: jsonStringToArray.refine((arr: string[]) => arr.length >= 1, 'Select at least one time slot'),

        mentorType: z.enum(['Academic', 'Industry']),

        // Branch A: Academic
        qualification: z.string().optional(),
        domain: z.string().optional(),
        university: z.string().optional(),
        graduationYear: z.string().optional(),
        expertise: z.string().optional(),
        academicSpan: z.string().optional(),

        // Branch B: Industry
        industryCategory: z.string().optional(),
        experienceYears: z.string().optional(),
        currentRole: z.string().optional(),
        skills: z.string().optional(),
        guidanceAreas: jsonStringToArray.optional(),
        experienceSummary: z.string().optional(),
    })
    .superRefine((data: any, ctx: z.RefinementCtx) => {
        if (data.mentorType === 'Academic') {
            if (!data.qualification)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['qualification'],
                    message: 'Qualification is required',
                });
            if (!data.domain)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['domain'],
                    message: 'Domain is required',
                });
            if (!data.university)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['university'],
                    message: 'University is required',
                });
            if (!data.graduationYear)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['graduationYear'],
                    message: 'Graduation Year is required',
                });
            if (!data.expertise)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['expertise'],
                    message: 'Area of Expertise is required',
                });
            if (!data.academicSpan)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['academicSpan'],
                    message: 'Academic Span is required',
                });
        } else if (data.mentorType === 'Industry') {
            if (!data.industryCategory)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['industryCategory'],
                    message: 'Industry Category is required',
                });
            if (!data.experienceYears)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['experienceYears'],
                    message: 'Years of experience is required',
                });
            if (!data.currentRole)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['currentRole'],
                    message: 'Current Role is required',
                });
            if (!data.skills || data.skills.length < 3)
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['skills'],
                    message: 'Skills are required',
                });
        }
    });

export type MentorApplicationInput = z.infer<typeof mentorApplicationSchema>;

