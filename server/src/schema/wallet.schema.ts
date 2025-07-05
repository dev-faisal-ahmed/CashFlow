import { NotFoundException } from '@nestjs/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

// Wallet
@Schema({ collection: 'wallets', statics: { async isOwner() {} } })
export class Wallet {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isSaving: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const WalletSchema = SchemaFactory.createForClass<Wallet>(Wallet);

// statics methods
WalletSchema.statics.isOwner = async function (walletId: string, userId: string) {
  const wallet = await this.findOne({ _id: walletId }, '_id ownerId');
  if (!wallet) throw new NotFoundException('Wallet not found!');
  return wallet.ownerId.equals(new Types.ObjectId(userId));
};

export type WalletDocument = HydratedDocument<Wallet>;
export type TWallet = Pick<WalletDocument, '_id' | 'name' | 'ownerId' | 'isSaving'>;

export type TWalletModel = Model<Wallet> & {
  isOwner: (walletId: string, userId: string) => Promise<boolean>;
};
