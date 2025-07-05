import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// Wallet
@Schema({ collection: 'wallets' })
export class Wallet {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isSaving: boolean;
}

export const WalletSchema = SchemaFactory.createForClass<Wallet>(Wallet);
export type WalletDocument = HydratedDocument<Wallet>;
export type TWallet = Pick<WalletDocument, '_id' | 'name' | 'ownerId' | 'isSaving'>;
