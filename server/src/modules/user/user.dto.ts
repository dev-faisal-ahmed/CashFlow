import { UserProvider } from 'src/modules/user/user.schema';
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid Email'),
  password: z.string().optional(),
  image: z.string().optional(),
  provider: z.nativeEnum(UserProvider),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  password: z.string().optional(),
  image: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
