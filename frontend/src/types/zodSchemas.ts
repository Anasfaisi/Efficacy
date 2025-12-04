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
      .max(64, 'Password must be less than 64 characters')
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
    .max(64, 'Password must be less than 64 characters')
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

export const mentorFormSchema = z.object({
  fullName: z.string().min(3, 'Name is too short'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number'),
  alternateEmail: z.string().email('Invalid email'),

  city: z.string().min(3),
  country: z.string().min(3),
  bio: z.string().min(20, 'Bio must be at least 20 characters'),
  state: z.string().min(3),

  highestQualification: z.string().min(2),
  university: z.string().min(3,"too small").regex(/^[A-za-z]/,"only alphabets"),
  graduationYear: z.string().regex(/^[0-9]{4}$/, 'must be numbers'),

  experienceYears: z
    .string()
    .regex(/^[0-9]+$/, 'Enter years as number')
    .optional(),
  skills: z.string().min(4,'minimum 4 characters').regex(/^[A-za-z]/,"only alphabets"),
  experienceSummary: z.string().min(20),

  publicProfile: z.string().url('Must be a valid URL'),

  availableDays: z.enum(
    [
      'Monday to Friday',
      'Thursday to Saturday',
      'Saturday & Sunday',
      'All Days',
      'Weekdays',
      'Weekends',
    ],
    'choose the prefered days',
  ),
  preferredTime: z.enum(
    ['5 PM - 8 PM ', '10 AM - 1 PM', '2 PM - 5 PM', '9 AM - 5 PM'],
    'choose prefered time',
  ),
  sessionsPerWeek: z.string().regex(/^[0-9]$/, 'must be numbers'),

  // FILES
  resume: z
    .custom<FileList>((val) => val instanceof FileList, { message: 'Required' })
    .refine((files) => files.length > 0, { message: 'Upload a file' })
    .refine((files) => files[0]?.size < 5 * 1024 * 1024, {
      message: 'File must be < 5MB',
    }),
  identityProof: z
    .custom<FileList>((val) => val instanceof FileList, { message: 'Required' })
    .refine((files) => files.length > 0, {
      message: 'Any residential Identity Proof is required',
    })
    .refine((files) => files[0]?.size < 5 * 1024 * 1024, {
      message: 'File must be < 5MB',
    }),
  certificates: z
    .custom<FileList>((val) => val instanceof FileList, { message: 'Required' })
    .refine((files) => files.length > 0, { message: 'upload the certificate' })
    .refine((files) => files[0]?.size < 5 * 1024 * 1024, {
      message: 'File must be < 5MB',
    }),
});

export type mentorFormSchemaType = z.infer<typeof mentorFormSchema>;
export type resetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type forgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type loginFormSchema = z.infer<typeof loginFormSchema>;
