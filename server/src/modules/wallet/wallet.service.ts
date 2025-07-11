import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Wallet, WalletDocument } from '@/schema/wallet.schema';
import { TransactionService } from '../transaction/transaction.service';
import { getMeta, getPaginationInfo, selectFields } from '@/utils';
import { ResponseDto } from '@/common/dto/response.dto';
import { CreateWalletDto, UpdateWalletDto } from './wallet.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { TransactionNature } from '@/schema/transaction.schema';
import { Connection, Model, Types } from 'mongoose';
import { TQueryParams } from '@/types';
import { WalletHelper } from './wallet.helper';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly transactionService: TransactionService,
    private readonly walletHelper: WalletHelper,
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
    const isSaving = query.isSaving;
    const requestedFields = query.fields;
    const { getAll, limit, page, skip } = getPaginationInfo(query);

    const dbQuery = {
      isDeleted: false,
      ownerId,
      ...(search && { name: { $regex: search, $options: 'i' } }),
      ...(isSaving === 'true' || isSaving === 'false' ? { isSaving: isSaving === 'true' } : {}),
    };

    const fields = selectFields(query.fields, ['_id', 'name', 'ownerId', 'isSaving', 'balance', 'membersCount']);

    const wallets = await this.walletModel.aggregate([
      { $match: dbQuery },
      ...(requestedFields.includes('balance') ? this.walletHelper.buildBalancePipeline() : []),
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

  // shared
  async getInfoForTransfer(fromWalletId: Types.ObjectId, toWalletId: Types.ObjectId): Promise<WalletTransferInfo> {
    const fromId = new Types.ObjectId(fromWalletId);
    const toId = new Types.ObjectId(toWalletId);

    const [wallets] = await this.walletModel.aggregate([
      { $match: { _id: { $in: [fromId, toId] } } },
      {
        $facet: {
          fromWallet: [
            { $match: { _id: fromId } },
            ...this.walletHelper.buildBalancePipeline(),
            { $project: { _id: 1, name: 1, ownerId: 1, balance: 1, isDeleted: 1 } },
          ],
          toWallet: [{ $match: { _id: toId } }, { $project: { _id: 1, name: 1, ownerId: 1, isDeleted: 1 } }],
        },
      },
      { $project: { fromWallet: { $arrayElemAt: ['$fromWallet', 0] }, toWallet: { $arrayElemAt: ['$toWallet', 0] } } },
    ]);

    if (!wallets.fromWallet || !wallets.toWallet) throw new NotFoundException('Wallet not found!');
    return { fromWallet: wallets.fromWallet, toWallet: wallets.toWallet };
  }

  // helpers
  async isOwner(walletId: string, userId: string) {
    const wallet = await this.walletModel.findOne({ _id: walletId }, '_id ownerId');
    if (!wallet) throw new NotFoundException('Wallet not found!');
    return wallet.ownerId.equals(new Types.ObjectId(userId));
  }
}

type WalletTransferInfo = {
  fromWallet: Pick<WalletDocument, '_id' | 'name' | 'ownerId' | 'isDeleted'> & { balance: number };
  toWallet: Pick<WalletDocument, '_id' | 'name' | 'ownerId' | 'isDeleted'>;
};
