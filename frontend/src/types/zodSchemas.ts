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
    )

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
    // Step 1: Personal Information
    name: z.string().min(3, 'Name is too short'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number'),
    city: z.string().min(3, 'City is required'),
    state: z.string().min(3, 'State is required'),
    country: z.string().min(3, 'Country is required'),
    bio: z.string().min(20, 'Bio must be at least 20 characters'),

    // Step 2: Public & Social Links
    linkedin: z.string().url('Must be a valid URL'),
    github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    personalWebsite: z
      .string()
      .url('Must be a valid URL')
      .optional()
      .or(z.literal('')),

    // Step 4: Availability & Sessions
    availableDays: z.array(z.string()).min(1, 'Select at least one day'),
    preferredTime: z.array(z.string()).min(1, 'Select at least one time slot'),
    sessionMode: z.enum(['Call', 'Chat', 'Both']),
    sessionsPerWeek: z.string().regex(/^[0-9]+$/, 'Must be a number'),

    // Step 5: Mentor Type Branching
    mentorType: z.enum(['Academic', 'Industry']),

    // Branch A: Academic
    qualification: z.string().optional(),
    university: z.string().optional(), // Optional in schema, enforced in refine
    graduationYear: z.string().optional(),
    academicDomain: z.string().optional(),
    subDomain: z.string().optional(),
    studentLevel: z.array(z.string()).optional(),
    academicExperience: z.string().optional(),

    // Branch B: Industry
    industryCategory: z.string().optional(),
    experienceYears: z.string().optional(),
    currentRole: z.string().optional(),
    skills: z.string().optional(), // Comma separated string or tags
    guidanceAreas: z.array(z.string()).optional(),
    experienceSummary: z.string().optional(), // Merged/Renamed logic
  })
  .superRefine((data, ctx) => {
    if (data.mentorType === 'Academic') {
      if (!data.qualification)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['qualification'],
          message: 'Qualification is required',
        });
      if (!data.university)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['university'],
          message: 'University is required',
        });
      if (!data.academicDomain)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['academicDomain'],
          message: 'Academic Domain is required',
        });
      if (!data.academicExperience)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['academicExperience'],
          message: 'Academic Experience is required',
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

export type mentorFormSchemaType = z.infer<typeof mentorFormSchema>;
export type resetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type forgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type loginFormSchemaType = z.infer<typeof loginFormSchema>;
