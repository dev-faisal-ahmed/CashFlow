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

export type RegisterWithCredentialsDto = z.infer<
  typeof registerWithCredentialsSchema
>;

export type LoginWithGoogleDto = z.infer<typeof loginWithGoogleSchema>;
