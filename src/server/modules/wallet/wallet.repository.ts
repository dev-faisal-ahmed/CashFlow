import util from "util";

import { ClientSession, Types } from "mongoose";
import { IWallet } from "./wallet.interface";
import { WalletModel } from "./wallet.schema";
import { PaginationHelper } from "@/server/helpers/pagination.helper";
import { QueryHelper } from "@/server/helpers/query.helper";
import { WalletHelper } from "./wallet.helper";
import { GetAllWalletsArgs, UpdateWalletDto } from "./wallet.validation";
import { AppError } from "@/server/core/app.error";

export class WalletRepository {
  private walletHelper: WalletHelper;

  constructor() {
    this.walletHelper = new WalletHelper();
  }

  async createWallet(dto: CreateWalletDto, session: ClientSession) {
    return WalletModel.create([{ ...dto }], { session });
  }

  async getAllWallets(query: GetAllWalletsArgs, ownerId: Types.ObjectId) {
    const { search, isSaving, page } = query;
    const requestedFields = query.fields;
    const paginationHelper = new PaginationHelper(page, query.limit, query.getAll);

    const dbQuery = {
      isDeleted: false,
      ownerId,
      ...(search && { name: { $regex: search, $options: "i" } }),
      ...(isSaving !== undefined && { isSaving }),
    };

    const { getAll, skip, limit } = paginationHelper.getPaginationInfo();
    const fields = QueryHelper.selectFields(query.fields, ["_id", "name", "ownerId", "isSaving", "balance"]);

    const wallets = await WalletModel.aggregate([
      { $match: dbQuery },
      ...(requestedFields?.includes("balance") ? this.walletHelper.buildBalancePipeline() : []),
      ...(fields ? [{ $project: fields }] : []),
      ...(!getAll ? [{ $skip: skip }, { $limit: limit }] : []),
    ]);

    console.log(util.inspect(wallets, { showHidden: false, depth: null, colors: true }));

    const total = await WalletModel.countDocuments(dbQuery);
    const meta = paginationHelper.getMeta(total);

    return { wallets, meta };
  }

  // get one or multiple wallet balance info
  async getWalletInfoForTransfer(senderId: string, receiverId: string) {
    const senderObjectId = new Types.ObjectId(senderId);
    const receiverObjectId = new Types.ObjectId(receiverId);

    const [walletInfo] = await WalletModel.aggregate([
      { $match: { _id: { $in: [senderObjectId, receiverObjectId] } } },
      {
        $facet: {
          senderWallet: [
            { $match: { _id: senderObjectId } },
            ...this.walletHelper.buildBalancePipeline(),
            { $project: { _id: 1, name: 1, ownerId: 1, balance: 1, isDeleted: 1 } },
          ],
          receiverWallet: [{ $match: { _id: receiverObjectId } }, { $project: { _id: 1, name: 1, ownerId: 1, isDeleted: 1 } }],
        },
      },
      { $project: { senderWallet: { $arrayElemAt: ["$senderWallet", 0] }, receiverWallet: { $arrayElemAt: ["$receiverWallet", 0] } } },
    ]);

    return { senderWallet: walletInfo.senderWallet, receiverWallet: walletInfo.receiverWallet };
  }

  async updateWallet(dto: UpdateWalletDto, walletId: string) {
    return WalletModel.updateOne({ _id: walletId }, { $set: dto });
  }

  async deleteWallet(walletId: string) {
    return WalletModel.updateOne({ _id: walletId }, { $set: { isDeleted: true } });
  }

  // helper
  async isWalletExistWithName(name: string, ownerId: string) {
    return WalletModel.findOne({ name, ownerId }, { _id: 1 }).lean();
  }

  async isOwner(walletId: string, userId: Types.ObjectId) {
    const wallet = await WalletModel.findOne({ _id: walletId }, { ownerId: 1 }).lean();
    if (!wallet) throw new AppError("Wallet not found!", 404);
    return wallet.ownerId.equals(userId);
  }
}

type CreateWalletDto = Pick<IWallet, "name" | "isSaving" | "ownerId">;
