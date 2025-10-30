import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
    
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// Register validation schema

// Type inference from schemas
export type LoginFormData = z.infer<typeof loginSchema>;


// Register validation schema
export const registerSchema = z.object({
    name: z.string().min(1, 'Full name is required'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
