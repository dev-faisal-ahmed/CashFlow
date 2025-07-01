import { Model } from 'mongoose';
import { Wallet, WalletDocument } from '../../schema/wallet.schema';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CreateWalletDto } from './wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TQueryParams } from 'src/common/types';
import { getMeta, getPaginationInfo, selectFields } from 'src/utils';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    private readonly transactionService: TransactionService,
  ) {}

  async createWallet(dto: CreateWalletDto, ownerId: string) {
    // checking if user has already anu wallet with the same name
    const isWalletExist = await this.walletModel.findOne({ name: dto.name, ownerId: ownerId }).select('_id').lean();
    if (isWalletExist) throw new BadRequestException('A wallet with same name already exist!');

    const session = await this.walletModel.db.startSession();
    session.startTransaction();
    try {
      const [wallet] = await this.walletModel.create([{ ...dto, ownerId }], { session });

      if (dto.initialBalance) {
        const transaction = await this.transactionService.createInitialTransaction(
          {
            walletId: wallet._id,
            amount: dto.initialBalance,
            description: `Added ${dto.initialBalance} tk as initial balance`,
          },
          session,
        );

        if (!transaction) throw new InternalServerErrorException('Failed to create transaction');
      }
      await session.commitTransaction();
      return new ResponseDto('Wallet created successfully');
    } catch {
      await session.abortTransaction();
      throw new InternalServerErrorException('Failed to create wallet with');
    } finally {
      await session.endSession();
    }
  }

  async getWallets(query: TQueryParams, userId: string) {
    const search = query.search;
    const { getAll, limit, page, skip } = getPaginationInfo(query);

    const dbQuery = { ownerId: userId, ...(search && { name: { $regex: search, $options: 'i' } }) };
    const fields = selectFields(query.fields);

    const wallets = await this.walletModel.aggregate([
      { $match: dbQuery },
      ...(!getAll ? [{ $skip: skip }, { $limit: limit }] : []),
      ...(fields ? [{ $project: fields }] : []),
    ]);

    const total = await this.walletModel.countDocuments(dbQuery);
    const meta = getMeta({ page, limit, total });

    return new ResponseDto('Wallets fetched successfully', wallets, meta);
  }
}
