import { UserProvider } from 'src/schemas/user.schema';

export type LoggedUser = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  provider: UserProvider;
};
