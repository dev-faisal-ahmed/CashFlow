import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum BudgetInterval {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

@Schema({ _id: false })
class Budget {
  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ enum: BudgetInterval, required: true })
  interval: BudgetInterval;
}

@Schema({ collection: 'sources', timestamps: true })
export class Source {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Budget, required: false })
  budget?: Budget;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const SourceSchema = SchemaFactory.createForClass(Source);
export type SourceDocument = HydratedDocument<Source>;
export type TSource = Pick<SourceDocument, '_id' | 'name' | 'userId' | 'budget'>;
