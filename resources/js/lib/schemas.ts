import { z } from 'zod';

// Post caption validation: required, max 255 characters
export const postCaptionSchema = z
    .string()
    .min(1, 'Caption is required')
    .max(255, 'Caption must be 255 characters or less')
    .trim();

// Comment body validation: required, max 2000 characters
export const commentBodySchema = z
    .string()
    .min(1, 'Comment is required')
    .max(2000, 'Comment must be 2000 characters or less')
    .trim();

// User name validation: required, max 255 characters, name pattern
export const userNameSchema = z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be 255 characters or less')
    .regex(
        /^[a-zA-Z\s\-']+$/,
        'Name can only contain letters, spaces, hyphens, and apostrophes',
    )
    .trim();

// User bio validation: optional, max 500 characters
export const userBioSchema = z
    .string()
    .max(500, 'Bio must be 500 characters or less')
    .optional();

// Email validation: valid email format
export const emailSchema = z
    .string()
    .email('Invalid email address')
    .toLowerCase();

// Password validation: min 8 characters, uppercase, lowercase, number
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    );

// Password confirmation validation
export const passwordConfirmationSchema = z.string();

// File upload validation: image and video types, max 10MB
export const imageFileSchema = z
    .instanceof(File)
    .refine(
        (file) => file.size <= 10 * 1024 * 1024,
        'File must be 10MB or less',
    )
    .refine(
        (file) =>
            [
                'image/jpeg',
                'image/png',
                'image/webp',
                'image/gif',
                'video/mp4',
                'video/webm',
                'video/quicktime',
            ].includes(file.type),
        'Invalid file type. Allowed: JPEG, PNG, WebP, GIF, MP4, WebM, MOV',
    );

// Multiple files validation (optional)
export const mediaFilesSchema = z
    .array(imageFileSchema)
    .min(1, 'At least one file is required')
    .max(10, 'Maximum 10 files allowed')
    .optional();

// Combined schemas for forms

// Create post schema
export const createPostSchema = z.object({
    caption: postCaptionSchema,
    media: mediaFilesSchema,
});

// Create comment schema
export const createCommentSchema = z.object({
    body: commentBodySchema,
});

// Update profile schema
export const updateProfileSchema = z.object({
    name: userNameSchema,
    bio: userBioSchema,
});

// Register schema
export const registerSchema = z
    .object({
        name: userNameSchema,
        email: emailSchema,
        password: passwordSchema,
        password_confirmation: passwordConfirmationSchema,
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords don't match",
        path: ['password_confirmation'],
    });

// Login schema
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
});

// Password update schema
export const updatePasswordSchema = z
    .object({
        current_password: z.string().min(1, 'Current password is required'),
        password: passwordSchema,
        password_confirmation: passwordConfirmationSchema,
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords don't match",
        path: ['password_confirmation'],
    });

// Two-factor challenge schema
export const twoFactorSchema = z.object({
    code: z
        .string()
        .min(6, 'Code must be 6 digits')
        .max(6, 'Code must be 6 digits')
        .regex(/^\d{6}$/, 'Code must be 6 digits'),
});

// Type exports for TypeScript
export type CreatePostData = z.infer<typeof createPostSchema>;
export type CreateCommentData = z.infer<typeof createCommentSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>;
export type TwoFactorData = z.infer<typeof twoFactorSchema>;
