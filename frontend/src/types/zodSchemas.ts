import z from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters')
      .regex(
        /^[A-Za-z\s]+$/,
        'Name must contain only letters and spaces (no numbers)',
      ),
    email: z
      .string()
      .trim()
      .email('Invalid email address')
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character',
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be less than 64 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),
});

export const mentorFormSchema = z
  .object({
    name: z.string().min(3, 'Name is too short'),
    phone: z
      .string()
      .regex(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number'),
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

    demoVideoLink: z
      .string()
      .url('Must be a valid video URL (YouTube Unlisted/Drive)'),

    availableDays: z.array(z.string()).min(3, 'Select at least 3 days'),
    preferredTime: z.array(z.string()).min(1, 'Select at least one time slot'),

    mentorType: z.enum(['Academic', 'Industry']),

    // Branch A: Academic
    qualification: z.string().optional(),
    domain: z.string().optional(),
    university: z.string().optional(),
    graduationYear: z.coerce.string().optional(),
    expertise: z.string().optional(),
    academicSpan: z.string().optional(),

    // Branch B: Industry
    industryCategory: z.string().optional(),
    experienceYears: z.string().optional(),
    currentRole: z.string().optional(),
    skills: z.string().optional(),
    guidanceAreas: z.array(z.string()).optional(),
    customGuidance: z.string().optional(),
    experienceSummary: z.string().optional(),
    monthlyCharge: z.coerce
      .number()
      .min(1500, 'Minimum charge is 1500')
      .max(2000, 'Maximum charge is 2000 during initial phase'),
  })
  .superRefine((data, ctx) => {
    if (data.mentorType === 'Academic') {
      // Academic needs Education details
      if (!data.qualification)
        ctx.addIssue({ code: 'custom', path: ['qualification'], message: 'Qualification is required' });
      if (!data.domain)
        ctx.addIssue({ code: 'custom', path: ['domain'], message: 'Domain is required' });
      if (!data.university)
        ctx.addIssue({ code: 'custom', path: ['university'], message: 'University is required' });
      if (!data.graduationYear)
        ctx.addIssue({ code: 'custom', path: ['graduationYear'], message: 'Graduation Year is required' });
      if (!data.expertise)
        ctx.addIssue({ code: 'custom', path: ['expertise'], message: 'Area of Expertise is required' });
      if (!data.academicSpan)
        ctx.addIssue({ code: 'custom', path: ['academicSpan'], message: 'Academic Span is required' });
      
      // Experience is optional for Academic, no extra checks needed
    } else if (data.mentorType === 'Industry') {
      // Industry needs Experience details
      if (!data.industryCategory)
        ctx.addIssue({ code: 'custom', path: ['industryCategory'], message: 'Industry Category is required' });
      if (!data.experienceYears)
        ctx.addIssue({ code: 'custom', path: ['experienceYears'], message: 'Years of experience is required' });
      if (!data.currentRole)
        ctx.addIssue({ code: 'custom', path: ['currentRole'], message: 'Current Role is required' });
      if (!data.skills || data.skills.length < 3)
        ctx.addIssue({ code: 'custom', path: ['skills'], message: 'Key skills are required (min 3)' });

      // Education is optional for Industry, no extra checks needed
    }
  });

export type mentorFormSchemaType = z.infer<typeof mentorFormSchema> & import('react-hook-form').FieldValues;
export type resetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type forgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type loginFormSchemaType = z.infer<typeof loginFormSchema>;
