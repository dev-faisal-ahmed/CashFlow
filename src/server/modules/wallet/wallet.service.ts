import { Types, startSession } from "mongoose";
import { AppError } from "@/server/core/app.error";
import { TransactionRepository } from "../transaction/transaction.repository";
import { WalletRepository } from "./wallet.repository";
import { CreateWalletDto } from "./wallet.validation";

export class WalletService {
  private walletRepository: WalletRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    this.walletRepository = new WalletRepository();
    this.transactionRepository = new TransactionRepository();
  }

  async createWalletWithInitialTransaction(dto: CreateWalletDto, ownerId: Types.ObjectId) {
    const isWalletExist = await this.walletRepository.isWalletExistWithName(dto.name, ownerId.toString());
    if (isWalletExist) throw new AppError("Wallet already exists", 409);

    const session = await startSession();
    session.startTransaction();

    try {
      const [wallet] = await this.walletRepository.createWallet({ ...dto, ownerId }, session);

      if (dto.initialBalance) {
        const transaction = await this.transactionRepository.createInitialTransaction(
          { ownerId, amount: dto.initialBalance, walletId: wallet._id },
          session,
        );

        if (!transaction) throw new AppError("Failed to create initial transaction", 500);
      }

      await session.commitTransaction();
      return wallet;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
