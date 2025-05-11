import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: false })
  image: string;

  @Prop({ required: true })
  provider: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
