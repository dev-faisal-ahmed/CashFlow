import { Wallet, WalletDocument } from '@/schema/wallet.schema';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { getMeta, getPaginationInfo, selectFields } from '@/utils';
import { ResponseDto } from '@/common/dto/response.dto';
import { CreateWalletDto, UpdateWalletDto } from './wallet.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { TransactionNature } from '@/schema/transaction.schema';
import { Connection, Model, Types } from 'mongoose';
import { TQueryParams } from '@/types';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
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
        const transaction = await this.transactionService.createInitialTransaction(
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
            // Basic transactions
            {
              $lookup: {
                from: 'transactions',
                let: { walletId: '$_id' },
                pipeline: [
                  { $match: { $expr: { $and: [{ $eq: ['$walletId', '$$walletId'] }, { $in: ['$type', ['INITIAL', 'REGULAR', 'BORROW_LEND']] }] } } },
                  { $project: { amount: 1, nature: 1 } },
                ],
                as: 'basicTransactions',
              },
            },

            // Transfer IN
            {
              $lookup: {
                from: 'transactions',
                let: { walletId: '$_id' },
                pipeline: [
                  { $match: { $expr: { $and: [{ $eq: ['$destinationWalletId', '$$walletId'] }, { $eq: ['$type', 'TRANSFER'] }] } } },
                  { $project: { amount: 1, nature: { $literal: 'INCOME' } } },
                ],
                as: 'incomeTransfers',
              },
            },

            // Transfer Out
            {
              $lookup: {
                from: 'transactions',
                let: { walletId: '$_id' },
                pipeline: [
                  { $match: { $expr: { $and: [{ $eq: ['$sourceWalletId', '$$walletId'] }, { $eq: ['$type', 'TRANSFER'] }] } } },
                  { $project: { amount: 1, nature: { $literal: 'EXPENSE' } } },
                ],
                as: 'expenseTransfers',
              },
            },

            { $addFields: { allTransactions: { $concatArrays: ['$basicTransactions', '$incomeTransfers', '$expenseTransfers'] } } },
            {
              $addFields: {
                balance: {
                  $sum: {
                    $map: {
                      input: '$allTransactions',
                      as: 'tx',
                      in: { $cond: [{ $eq: ['$$tx.nature', 'INCOME'] }, '$$tx.amount', { $multiply: ['$$tx.amount', -1] }] },
                    },
                  },
                },
              },
            },
            { $project: { basicTransactions: 0, incomeTransfers: 0, expenseTransfers: 0, allTransactions: 0 } },
          ]
        : []),

      ...(fields ? [{ $project: fields }] : []),
      ...(!getAll ? [{ $skip: skip }, { $limit: limit }] : []),
    ]);

    const total = await this.walletModel.countDocuments(dbQuery);
    const meta = getMeta({ page, limit, total });

    return new ResponseDto({ message: 'Wallets fetched successfully', meta, data: wallets });
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
