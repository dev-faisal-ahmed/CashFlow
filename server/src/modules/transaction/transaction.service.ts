import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { Transaction, TransactionDocument, TransactionType } from '@/schema/transaction.schema';
import { CreateInitialTransactionDto, CreateTransferTransactionDto } from './transaction.dto';
import { WalletService } from '@/modules/wallet/wallet.service';
import { ResponseDto } from '@/common/dto/response.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @Inject(forwardRef(() => WalletService)) private readonly walletService: WalletService,
  ) {}

  async createTransferTransaction(dto: CreateTransferTransactionDto, userId: string) {
    const { fromWallet, toWallet } = await this.walletService.getInfoForTransfer(dto.sourceWalletId, dto.destinationWalletId);
    const userObjId = new Types.ObjectId(userId);

    const isFromWalletOwner = fromWallet.ownerId.equals(userObjId);
    const isToWalletOwner = toWallet.ownerId.equals(userObjId);

    if (!isFromWalletOwner) throw new UnauthorizedException('You are not authorized to transfer from this wallet');
    if (!isToWalletOwner) throw new UnauthorizedException('You are not authorized to transfer to this wallet');
    if (fromWallet.isDeleted) throw new BadRequestException('Source wallet is deleted');
    if (toWallet.isDeleted) throw new BadRequestException('Destination wallet is deleted');
    if (dto.amount > fromWallet.balance) throw new BadRequestException('Insufficient balance');

    // start the transfer
    await this.transactionModel.create({
      type: TransactionType.TRANSFER,
      amount: dto.amount,
      description: dto.description || `Transferred ${dto.amount} tk from ${fromWallet.name} to ${toWallet.name}`,
      sourceWalletId: dto.sourceWalletId,
      destinationWalletId: dto.destinationWalletId,
    });

    return new ResponseDto('Transfer has been successful');
  }

  // Shared
  async createInitialTransaction(dto: CreateInitialTransactionDto, session: ClientSession) {
    const [result] = await this.transactionModel.create([{ ...dto, type: TransactionType.INITIAL }], { session });
    return result;
  }
}
