import { z } from 'zod';

const contactSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'The name must be at least 3 characters' })
    .max(50, { message: 'The name must be less than 50 characters' })
    .regex(/^[a-zA-Z0-9\s-]+$/, {
      message: 'The name can only contain letters, spaces, or hyphens',
    })
    .trim(),

  // phone: z
  //   .string()
  //   .regex(/^\d{10}$/, { message: 'Phone number must be 10 digits' })
  //   .optional(),

  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .max(128, { message: 'Email must be less than 128 characters' }),

  subject: z
    .string()
    .min(10, { message: 'The Subject must be at least 10 characters' })
    .max(128, { message: 'The Subject must be less than 128 characters' })
    .trim(),

  message: z
    .string()
    .min(20, { message: 'The message must be at least 20 characters' })
    .max(128, { message: 'The message must be less than 128 characters' })
    .trim(),
});

export { contactSchema };
