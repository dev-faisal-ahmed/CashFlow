import { z } from 'zod';

export const registerWithCredentialsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid Email'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterWithCredentialsDto = z.infer<
  typeof registerWithCredentialsSchema
>;
