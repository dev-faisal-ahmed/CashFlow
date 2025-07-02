import { Types } from 'mongoose';
import { UserProvider } from '@/schema/user.schema';

export type TLoggedUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  image?: string;
  provider: UserProvider;
};

export type TQueryParams = Record<string, string>;
