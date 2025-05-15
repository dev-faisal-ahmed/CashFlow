import { z } from 'zod';

export const registerWithCredentialsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid Email'),
  password: z.string().min(1, 'Password is required'),
});

export const loginWithGoogleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid Email'),
  image: z.string().optional(),
});

export const loginWithCredentialsSchema = z.object({
  email: z.string().email('Invalid Email'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Please provide old password'),
  newPassword: z.string().min(1, 'Please provide new password'),
});

export type RegisterWithCredentialsDto = z.infer<typeof registerWithCredentialsSchema>;
export type LoginWithGoogleDto = z.infer<typeof loginWithGoogleSchema>;
export type LoginWithCredentialsDto = z.infer<typeof loginWithCredentialsSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
