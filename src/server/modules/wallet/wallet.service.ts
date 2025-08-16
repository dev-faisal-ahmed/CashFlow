import { Types, startSession } from "mongoose";
import { AppError } from "@/server/core/app.error";
import { TransactionRepository } from "../transaction/transaction.repository";
import { WalletRepository } from "./wallet.repository";
import { CreateWalletDto, GetAllWalletsArgs, UpdateWalletDto } from "./wallet.validation";

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

  async getAllWallets(query: GetAllWalletsArgs, ownerId: Types.ObjectId) {
    return this.walletRepository.getAllWallets(query, ownerId);
  }

  async updateWallet(dto: UpdateWalletDto, walletId: string, userId: Types.ObjectId) {
    const isOwner = await this.walletRepository.isOwner(walletId, userId);
    if (!isOwner) throw new AppError("You are not authorized to update this wallet", 401);

    const result = await this.walletRepository.updateWallet(dto, walletId);
    if (!result.modifiedCount) throw new AppError("Wallet was not updated", 500);

    return result;
  }

  async deleteWallet(walletId: string, userId: Types.ObjectId) {
    const isOwner = await this.walletRepository.isOwner(walletId, userId);
    if (!isOwner) throw new AppError("You are not authorized to delete this wallet", 401);

    const result = await this.walletRepository.deleteWallet(walletId);
    if (!result.modifiedCount) throw new AppError("Wallet was not deleted", 500);

    return result;
  }
}
