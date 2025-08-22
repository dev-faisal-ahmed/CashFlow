import { Types, startSession } from "mongoose";
import { AppError } from "@/server/core/app.error";
import { GetAllWalletsArgs, UpdateWalletDto, WalletTransferDto } from "./wallet.validation";
import { IWallet } from "./wallet.interface";
import { WithUserId } from "@/server/types";
import { WalletModel } from "./wallet.schema";
import { InitialTransactionModel, TransferTransactionModel } from "../transaction/transaction.schema";
import { ETransactionNature } from "../transaction/transaction.interface";
import { PaginationHelper } from "@/server/helpers/pagination.helper";
import { QueryHelper } from "@/server/helpers/query.helper";

// types
type CreateWallet = Pick<IWallet, "name" | "isSaving" | "ownerId"> & { initialBalance?: number };
type GetWallets = WithUserId<{ query: GetAllWalletsArgs }>;
type UpdateWallet = WithUserId<{ id: string; dto: UpdateWalletDto }>;
type DeleteWallet = WithUserId<{ id: string }>;
type WalletTransfer = WithUserId<{ dto: WalletTransferDto }>;
type IsWalletExist = WithUserId<{ name: string }>;
type IsOwner = WithUserId<{ id: string }>;

export class WalletService {
  static async createWallet(dto: CreateWallet) {
    const isWalletExist = await this.isWalletExists({ name: dto.name, userId: dto.ownerId });
    if (isWalletExist) throw new AppError("Wallet already exists", 409);

    const session = await startSession();
    session.startTransaction();

    try {
      const [wallet] = await WalletModel.create([{ ...dto, balance: dto.initialBalance ?? 0 }], { session });

      if (dto.initialBalance) {
        const [transaction] = await InitialTransactionModel.create(
          [
            {
              ownerId: dto.ownerId,
              amount: dto.initialBalance,
              walletId: wallet._id,
              nature: ETransactionNature.income,
            },
          ],
          { session },
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

  static async getWallets({ query, userId }: GetWallets) {
    const { search, isSaving, page } = query;
    const paginationHelper = new PaginationHelper(page, query.limit, query.getAll);

    const dbQuery = {
      isDeleted: false,
      ownerId: userId,
      ...(search && { name: { $regex: search, $options: "i" } }),
      ...(isSaving !== undefined && { isSaving }),
    };

    const { getAll, skip, limit } = paginationHelper.getPaginationInfo();
    const fields = QueryHelper.selectFields(query.fields, ["_id", "name", "ownerId", "isSaving", "balance"]);

    const [result] = await WalletModel.aggregate([
      { $match: dbQuery },
      {
        $facet: {
          wallets: [...(!getAll ? [{ $skip: skip }, { $limit: limit }] : []), ...(fields ? [{ $project: fields }] : [])],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const wallets = result.wallets;
    const total = result.total[0].count;
    const meta = paginationHelper.getMeta(total);

    return { wallets, meta };
  }

  static async updateWallet({ id, userId, dto }: UpdateWallet) {
    const isOwner = await this.isOwner({ id, userId });
    if (!isOwner) throw new AppError("You are not authorized to update this wallet", 401);

    return WalletModel.updateOne({ _id: id }, { $set: dto });
  }

  static async deleteWallet({ id, userId }: DeleteWallet) {
    const isOwner = await this.isOwner({ id, userId });
    if (!isOwner) throw new AppError("You are not authorized to delete this wallet", 401);

    return WalletModel.updateOne({ _id: id }, { $set: { isDeleted: true } });
  }

  static async walletTransfer({ dto, userId }: WalletTransfer) {
    const senderObjectId = new Types.ObjectId(dto.senderWalletId);
    const receiverObjectId = new Types.ObjectId(dto.receiverWalletId);

    const [walletInfo] = await WalletModel.aggregate([
      { $match: { _id: { $in: [senderObjectId, receiverObjectId] } } },
      {
        $facet: {
          senderWallet: [{ $match: { _id: senderObjectId } }, { $project: { _id: 1, name: 1, ownerId: 1, balance: 1, isDeleted: 1 } }],
          receiverWallet: [{ $match: { _id: receiverObjectId } }, { $project: { _id: 1, name: 1, ownerId: 1, isDeleted: 1 } }],
        },
      },
      { $project: { senderWallet: { $arrayElemAt: ["$senderWallet", 0] }, receiverWallet: { $arrayElemAt: ["$receiverWallet", 0] } } },
    ]);

    const senderWallet = walletInfo.senderWallet;
    const receiverWallet = walletInfo.receiverWallet;

    if (!senderWallet) throw new AppError("Sender wallet not found", 404);
    if (!receiverWallet) throw new AppError("Receiver wallet not found", 404);
    if (!userId.equals(senderWallet.ownerId)) throw new AppError("You are not authorized to transfer money from this wallet", 401);
    if (!userId.equals(receiverWallet.ownerId)) throw new AppError("You are not authorized to transfer money to this wallet", 401);
    if (senderWallet.balance < dto.amount) throw new AppError("Insufficient balance", 400);

    return TransferTransactionModel.create({
      amount: dto.amount,
      destinationWalletId: receiverObjectId,
      ownerId: userId,
      sourceWalletId: senderObjectId,
      description: dto.description ? dto.description : `Transferred ${dto.amount}, from ${senderWallet.name} to ${receiverWallet.name}`,
    });
  }

  // helpers
  static async isWalletExists({ name, userId }: IsWalletExist) {
    return WalletModel.findOne({ name, ownerId: userId }, { _id: 1 }).lean();
  }

  static async isOwner({ id, userId }: IsOwner) {
    const wallet = await WalletModel.findOne({ _id: id }, { ownerId: 1 }).lean();
    if (!wallet) throw new AppError("Wallet not found!", 404);
    return wallet.ownerId.equals(userId);
  }
}
