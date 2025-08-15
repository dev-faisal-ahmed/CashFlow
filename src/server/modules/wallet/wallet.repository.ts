import { ClientSession } from "mongoose";
import { IWallet } from "./wallet.interface";
import { WalletModel } from "./wallet.schema";

export class WalletRepository {
  async createWallet(dto: CreateWalletDto, session: ClientSession) {
    return WalletModel.create([{ ...dto }], { session });
  }

  // helper
  async isWalletExistWithName(name: string, ownerId: string) {
    return WalletModel.findOne({ name, ownerId }, { _id: 1 }).lean();
  }
}

type CreateWalletDto = Pick<IWallet, "name" | "isSaving" | "ownerId">;
