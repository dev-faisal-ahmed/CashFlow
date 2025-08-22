import { Types, startSession } from "mongoose";
import { AppError } from "@/server/core/app.error";
import { TransactionRepository } from "../transaction/transaction.repository";
import { WalletRepository } from "./wallet.repository";
import { GetAllWalletsArgs, UpdateWalletDto, WalletTransferDto } from "./wallet.validation";
import { IWallet } from "./wallet.interface";
import { WithUserId } from "@/server/types";

// types
type CreateWallet = Pick<IWallet, "name" | "isSaving" | "ownerId"> & { initialBalance?: number };
type GetWallets = WithUserId<{ query: GetAllWalletsArgs }>;
type UpdateWallet = WithUserId<{ id: string; dto: UpdateWalletDto }>;
type DeleteWallet = WithUserId<{ id: string }>;
type WalletTransfer = WithUserId<{ dto: WalletTransferDto }>;

export class WalletService {
  private walletRepository: WalletRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    this.walletRepository = new WalletRepository();
    this.transactionRepository = new TransactionRepository();
  }

  async createWalletWithInitialTransaction({ ownerId, ...dto }: CreateWallet) {
    const isWalletExist = await this.walletRepository.isWalletExistWithName(dto.name, ownerId.toString());
    if (isWalletExist) throw new AppError("Wallet already exists", 409);

    const session = await startSession();
    session.startTransaction();

    try {
      const [wallet] = await this.walletRepository.createWallet({ dto: { ...dto, ownerId, balance: dto.initialBalance ?? 0 }, session });

      if (dto.initialBalance) {
        const transaction = await this.transactionRepository.createInitialTransaction({
          dto: { ownerId, amount: dto.initialBalance, walletId: wallet._id },
          session,
        });

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

  async getWallets({ query, userId }: GetWallets) {
    return this.walletRepository.getWallets(query, userId);
  }

  async updateWallet({ id, userId, dto }: UpdateWallet) {
    const isOwner = await this.walletRepository.isOwner(id, userId);
    if (!isOwner) throw new AppError("You are not authorized to update this wallet", 401);

    const result = await this.walletRepository.updateWallet(dto, id);
    if (!result.modifiedCount) throw new AppError("Wallet was not updated", 500);

    return result;
  }

  async deleteWallet({ id, userId }: DeleteWallet) {
    const isOwner = await this.walletRepository.isOwner(id, userId);
    if (!isOwner) throw new AppError("You are not authorized to delete this wallet", 401);

    const result = await this.walletRepository.updateWallet({ isDeleted: true }, id);
    if (!result.modifiedCount) throw new AppError("Wallet was not deleted", 500);

    return result;
  }

  async walletTransfer({ dto, userId }: WalletTransfer) {
    const { senderWallet, receiverWallet } = await this.walletRepository.getWalletInfoForTransfer(dto.senderWalletId, dto.receiverWalletId);

    if (!senderWallet) throw new AppError("Sender wallet not found", 404);
    if (!receiverWallet) throw new AppError("Receiver wallet not found", 404);
    if (!userId.equals(senderWallet.ownerId)) throw new AppError("You are not authorized to transfer money from this wallet", 401);
    if (!userId.equals(receiverWallet.ownerId)) throw new AppError("You are not authorized to transfer money to this wallet", 401);
    if (senderWallet.balance < dto.amount) throw new AppError("Insufficient balance", 400);

    const result = await this.transactionRepository.createTransferTransaction({
      amount: dto.amount,
      destinationWalletId: new Types.ObjectId(dto.receiverWalletId),
      ownerId: userId,
      sourceWalletId: new Types.ObjectId(dto.senderWalletId),
      description: dto.description ? dto.description : `Transferred ${dto.amount}, from ${senderWallet.name} to ${receiverWallet.name}`,
    });

    return result;
  }
}
