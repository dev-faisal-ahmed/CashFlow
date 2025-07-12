import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ collection: 'contacts', timestamps: true })
export class Contact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: false })
  address?: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
export type ContactDocument = HydratedDocument<Contact>;
export type TContact = Pick<ContactDocument, '_id' | 'name' | 'phone' | 'userId' | 'address' | 'isDeleted'>;
