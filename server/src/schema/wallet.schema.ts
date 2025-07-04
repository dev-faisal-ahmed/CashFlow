import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum WalletAccessPermission {
  VIEW = 'VIEW',
  ADD_FUND = 'ADD_FUND',
  SPEND_FUND = 'SPEND_FUND',
}

// Wallet Access
@Schema({ _id: false })
export class WalletMember {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  permissions: WalletAccessPermission[];
}

// Wallet
@Schema({ collection: 'wallets' })
export class Wallet {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({
    type: [WalletMember],
    default: [],
    validate: {
      validator: (members: WalletMember[]) => {
        const ids = members.map((m) => m.userId.toString());
        const idsSet = new Set(ids);
        return idsSet.size === ids.length;
      },
      message: 'Can not add same member twice',
    },
  })
  members: WalletMember[];

  @Prop({ type: Boolean, default: false })
  isSaving: boolean;
}

export const WalletSchema = SchemaFactory.createForClass<Wallet>(Wallet);
export type WalletDocument = HydratedDocument<Wallet>;
export type TWallet = Pick<WalletDocument, '_id' | 'name' | 'ownerId' | 'members' | 'isSaving'>;
