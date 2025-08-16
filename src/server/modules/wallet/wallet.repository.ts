import { ClientSession, Types } from "mongoose";
import { IWallet } from "./wallet.interface";
import { WalletModel } from "./wallet.schema";
import { PaginationHelper } from "@/server/helpers/pagination.helper";
import { QueryHelper } from "@/server/helpers/query.helper";
import { WalletHelper } from "./wallet.helper";
import { GetAllWalletsArgs } from "./wallet.validation";

export class WalletRepository {
  private walletHelper: WalletHelper;

  constructor() {
    this.walletHelper = new WalletHelper();
  }

  async createWallet(dto: CreateWalletDto, session: ClientSession) {
    return WalletModel.create([{ ...dto }], { session });
  }

  async getAllWallets(query: GetAllWalletsArgs, ownerId: Types.ObjectId) {
    const { search, isSaving, page, limit } = query;
    const requestedFields = query.fields;
    const paginationHelper = new PaginationHelper(page, limit, query.getAll);

    const dbQuery = {
      isDeleted: false,
      ownerId,
      ...(search && { name: { $regex: search, $options: "i" } }),
      ...(isSaving !== undefined && { isSaving }),
    };

    const { getAll, skip } = paginationHelper.getPaginationInfo();
    const fields = QueryHelper.selectFields(query.fields, ["_id", "name", "ownerId", "isSaving", "balance"]);

    const wallets: TGetAllWalletResponse["wallets"] = await WalletModel.aggregate([
      { $match: dbQuery },
      ...(requestedFields?.includes("balance") ? this.walletHelper.buildBalancePipeline() : []),
      ...(fields ? [{ $project: fields }] : []),
      ...(!getAll ? [{ $skip: skip }, { $limit: limit }] : []),
    ]);

    const total = await WalletModel.countDocuments(dbQuery);
    const meta = paginationHelper.getMeta(total);

    return { wallets, meta };
  }

  // helper
  async isWalletExistWithName(name: string, ownerId: string) {
    return WalletModel.findOne({ name, ownerId }, { _id: 1 }).lean();
  }
}

type CreateWalletDto = Pick<IWallet, "name" | "isSaving" | "ownerId">;

type TGetAllWalletResponse = {
  wallets: Array<Partial<Pick<IWallet, "_id" | "name" | "ownerId" | "isSaving">> & { balance: number }>;
};
