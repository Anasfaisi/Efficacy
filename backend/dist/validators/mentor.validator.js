"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMentorProfileSchema = exports.mentorApplicationSchema = void 0;
const zod_1 = require("zod");
const jsonStringToArray = zod_1.z.preprocess((val) => {
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        }
        catch {
            return val;
        }
    }
    return val;
}, zod_1.z.array(zod_1.z.string()));
exports.mentorApplicationSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(3, 'Name is too short'),
    phone: zod_1.z
        .string()
        .regex(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number'),
    city: zod_1.z.string().min(3, 'City is required'),
    state: zod_1.z.string().min(3, 'State is required'),
    country: zod_1.z.string().min(3, 'Country is required'),
    bio: zod_1.z.string().min(20, 'Bio must be at least 20 characters'),
    linkedin: zod_1.z.string().url('Must be a valid URL'),
    github: zod_1.z
        .string()
        .url('Must be a valid URL')
        .optional()
        .or(zod_1.z.literal('')),
    personalWebsite: zod_1.z
        .string()
        .url('Must be a valid URL')
        .optional()
        .or(zod_1.z.literal('')),
    demoVideoLink: zod_1.z
        .string()
        .url('Must be a valid video URL (YouTube Unlisted/Drive)'),
    availability: zod_1.z
        .preprocess((val) => {
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            }
            catch {
                return val;
            }
        }
        return val;
    }, zod_1.z.object({
        Monday: zod_1.z.array(zod_1.z.string()).optional(),
        Tuesday: zod_1.z.array(zod_1.z.string()).optional(),
        Wednesday: zod_1.z.array(zod_1.z.string()).optional(),
        Thursday: zod_1.z.array(zod_1.z.string()).optional(),
        Friday: zod_1.z.array(zod_1.z.string()).optional(),
        Saturday: zod_1.z.array(zod_1.z.string()).optional(),
        Sunday: zod_1.z.array(zod_1.z.string()).optional(),
    }))
        .optional(),
    mentorType: zod_1.z.enum(['Academic', 'Industry']).optional(),
    qualification: zod_1.z.string().optional(),
    domain: zod_1.z.string().optional(),
    university: zod_1.z.string().optional(),
    graduationYear: zod_1.z.string().optional(),
    expertise: zod_1.z.string().optional(),
    academicSpan: zod_1.z.string().optional(),
    industryCategory: zod_1.z.string().optional(),
    experienceYears: zod_1.z.string().optional(),
    currentRole: zod_1.z.string().optional(),
    skills: zod_1.z.string().optional(),
    guidanceAreas: jsonStringToArray.optional(),
    experienceSummary: zod_1.z.string().optional(),
    monthlyCharge: zod_1.z.coerce
        .number()
        .min(1500, 'Minimum charge is 1500')
        .max(2500, 'Maximum charge is 2500'),
})
    .superRefine((data, ctx) => {
    if (data.mentorType === 'Academic') {
        if (!data.qualification)
            ctx.addIssue({
                code: 'custom',
                path: ['qualification'],
                message: 'Qualification is required',
            });
        if (!data.domain)
            ctx.addIssue({
                code: 'custom',
                path: ['domain'],
                message: 'Domain is required',
            });
        if (!data.university)
            ctx.addIssue({
                code: 'custom',
                path: ['university'],
                message: 'University is required',
            });
        if (!data.graduationYear)
            ctx.addIssue({
                code: 'custom',
                path: ['graduationYear'],
                message: 'Graduation Year is required',
            });
        if (!data.expertise)
            ctx.addIssue({
                code: 'custom',
                path: ['expertise'],
                message: 'Area of Expertise is required',
            });
        if (!data.academicSpan)
            ctx.addIssue({
                code: 'custom',
                path: ['academicSpan'],
                message: 'Academic Span is required',
            });
    }
    else if (data.mentorType === 'Industry') {
        if (!data.industryCategory)
            ctx.addIssue({
                code: 'custom',
                path: ['industryCategory'],
                message: 'Industry Category is required',
            });
        if (!data.experienceYears)
            ctx.addIssue({
                code: 'custom',
                path: ['experienceYears'],
                message: 'Years of experience is required',
            });
        if (!data.currentRole)
            ctx.addIssue({
                code: 'custom',
                path: ['currentRole'],
                message: 'Current Role is required',
            });
        if (!data.skills || data.skills.length < 3)
            ctx.addIssue({
                code: 'custom',
                path: ['skills'],
                message: 'Skills are required',
            });
    }
});
exports.updateMentorProfileSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(3).optional(),
    phone: zod_1.z
        .string()
        .regex(/^[0-9]{10}$/)
        .optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    bio: zod_1.z.string().min(20).optional(),
    linkedin: zod_1.z.string().url().optional(),
    github: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    personalWebsite: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    demoVideoLink: zod_1.z.string().url().optional(),
    mentorType: zod_1.z.enum(['Academic', 'Industry']).optional(),
    qualification: zod_1.z.string().optional(),
    domain: zod_1.z.string().optional(),
    university: zod_1.z.string().optional(),
    graduationYear: zod_1.z.string().optional(),
    expertise: zod_1.z.string().optional(),
    academicSpan: zod_1.z.string().optional(),
    industryCategory: zod_1.z.string().optional(),
    experienceYears: zod_1.z.string().optional(),
    currentRole: zod_1.z.string().optional(),
    skills: zod_1.z.string().optional(),
    achievements: zod_1.z.array(zod_1.z.string()).optional(),
    monthlyCharge: zod_1.z.coerce.number().optional(),
    currentPassword: zod_1.z.string().optional(),
    newPassword: zod_1.z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .optional(),
})
    .partial()
    .catchall(zod_1.z.any());
//# sourceMappingURL=mentor.validator.js.map