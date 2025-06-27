import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
class WalletMember {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

@Schema({ collection: 'wallets' })
export class Wallet {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  icon: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: [WalletMember], default: [] })
  members: WalletMember[];

  @Prop({ type: Boolean, default: false })
  isSaving: boolean;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
export type WalletType = Pick<HydratedDocument<Wallet>, '_id' | 'name' | 'icon' | 'ownerId' | 'members' | 'isSaving'>;
