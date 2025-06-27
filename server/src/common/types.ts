import { Types } from 'mongoose';
import { UserProvider } from 'src/modules/user/user.schema';

export type LoggedUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  image?: string;
  provider: UserProvider;
};
