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

    const total = await WalletModel.countDocuments(dbQuery);
    const meta = paginationHelper.getMeta(total);

    return { wallets, meta };
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
