import { Wallet } from '@/schema/wallet.schema';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { getMeta, getPaginationInfo, selectFields } from '@/utils';
import { ResponseDto } from '@/common/dto/response.dto';
import { CreateWalletDto, UpdateWalletDto } from './wallet.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { TQueryParams } from '@/types';
import { TransactionNature } from '@/schema/transaction.schema';
import { Connection, Model, Types } from 'mongoose';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @InjectConnection() private readonly connection: Connection,
    private readonly transactionService: TransactionService,
  ) {}

  async create(dto: CreateWalletDto, ownerId: string) {
    // checking if user has already anu wallet with the same name
    const isWalletExist = await this.walletModel.findOne({ name: dto.name, ownerId: ownerId }).select('_id').lean();
    if (isWalletExist) throw new BadRequestException('A wallet with same name already exist!');

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const [wallet] = await this.walletModel.create([{ ...dto, ownerId }], { session });

      if (dto.initialBalance) {
        const transaction = await this.transactionService.createInitial(
          {
            walletId: wallet._id,
            amount: dto.initialBalance,
            description: `Added ${dto.initialBalance} tk as initial balance`,
            nature: TransactionNature.INCOME,
          },
          session,
        );

        if (!transaction) throw new InternalServerErrorException('Failed to create transaction');
      }
      await session.commitTransaction();
      return new ResponseDto('Wallet created successfully');
    } catch {
      await session.abortTransaction();
      throw new InternalServerErrorException('Failed to create wallet');
    } finally {
      await session.endSession();
    }
  }

  async getAll(query: TQueryParams, ownerId: string) {
    const search = query.search;
    const requestedFields = query.fields;
    const { getAll, limit, page, skip } = getPaginationInfo(query);

    const dbQuery = { isDeleted: false, ownerId, ...(search && { name: { $regex: search, $options: 'i' } }) };
    const fields = selectFields(query.fields, ['_id', 'name', 'ownerId', 'isSaving', 'balance', 'membersCount']);

    const wallets = await this.walletModel.aggregate([
      { $match: dbQuery },

      // only apply look up and sum when user wanted balance
      ...(requestedFields.includes('balance')
        ? [
            { $lookup: { from: 'transactions', localField: '_id', foreignField: 'walletId', as: 'transactions' } },
            {
              $addFields: {
                balance: {
                  $sum: {
                    $map: {
                      input: '$transactions',
                      as: 'tx',
                      in: { $cond: [{ $eq: ['$$tx.nature', 'INCOME'] }, '$$tx.amount', { $multiply: ['$$tx.amount', -1] }] },
                    },
                  },
                },
              },
            },
          ]
        : []),

      ...(fields ? [{ $project: fields }] : []),
      ...(!getAll ? [{ $skip: skip }, { $limit: limit }] : []),
    ]);

    const total = await this.walletModel.countDocuments(dbQuery);
    const meta = getMeta({ page, limit, total });

    return new ResponseDto('Wallets fetched successfully', wallets, meta);
  }

  async updateOne(dto: UpdateWalletDto, walletId: string, userId: string) {
    const isOwner = await this.isOwner(walletId, userId);
    if (!isOwner) throw new UnauthorizedException('You are not authorized to update this wallet');

    const result = await this.walletModel.updateOne({ _id: walletId }, { $set: dto });
    if (!result.modifiedCount) throw new InternalServerErrorException('Wallet was not updated');

    return new ResponseDto('Wallet updated successfully');
  }

  async deleteOne(walletId: string, userId: string) {
    const isOwner = await this.isOwner(walletId, userId);
    if (!isOwner) throw new UnauthorizedException('You are not authorized to delete this wallet');

    const result = await this.walletModel.updateOne({ _id: walletId }, { $set: { isDeleted: true } });
    if (!result.modifiedCount) throw new InternalServerErrorException('Could not delete the wallet');

    return new ResponseDto('Wallet Delete Successfully');
  }

  // helpers
  async isOwner(walletId: string, userId: string) {
    const wallet = await this.walletModel.findOne({ _id: walletId }, '_id ownerId');
    if (!wallet) throw new NotFoundException('Wallet not found!');
    return wallet.ownerId.equals(new Types.ObjectId(userId));
  }
}
