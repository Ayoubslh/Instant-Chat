import { z } from 'zod';

const userSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'The name must be at least 3 characters' })
    .max(50, { message: 'The name must be less than 50 characters' })
    .regex(/^[a-zA-Z0-9\s-]+$/, {
      message: 'The name can only contain letters, spaces, or hyphens',
    })
    .trim(),

  address: z.string().trim().optional(),

  phone: z
    .string()
    .regex(/^\d{10}$/, { message: 'Phone number must be 10 digits' })
    .optional(),

  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .max(128, { message: 'Email must be less than 128 characters' }),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(128, { message: 'Password must be less than 128 characters' }),

  confirmPassword: z
    .string()
    .min(1, { message: 'Password confirmation is required' }),

  role: z.enum(['Client', 'Admin']).default('Client'),

  image: z
    .instanceof(File, {
      message: '',
    })
    .optional()
    .refine(
      file => {
        if (file === null) return true;
        return ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
      },
      { message: 'Only .png and .jpg images are accepted' }
    )
    .refine(
      file => {
        if (!file) return true;
        return file.size <= 1024 * 1024 * 5;
      },
      { message: 'Image must be less than 5MB' }
    )
    .nullable(),

  otp: z.string().min(6, {
    message: 'Confirmation code is required and must be 6 characters',
  }),
});

export { userSchema };
