import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserProvider {
  GOOGLE = 'GOOGLE',
  CREDENTIALS = 'CREDENTIALS',
}

@Schema({ collection: 'users' })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: false })
  image: string;

  @Prop({ default: UserProvider.CREDENTIALS, enum: UserProvider })
  provider: UserProvider;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
export type UserType = Pick<UserDocument, '_id' | 'name' | 'email' | 'password' | 'image' | 'provider'>;
