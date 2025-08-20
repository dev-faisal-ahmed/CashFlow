import { walletClient } from "@/lib/client";
import { CreateWalletDto, GetAllWalletsArgs, WalletTransferDto } from "@/server/modules/wallet/wallet.validation";
import { walletSchema } from "./wallet.schema";
import { ToString } from "@/lib/types";

// Add
export const addWalletApi = async (dto: CreateWalletDto) => {
  const res = await walletClient.index.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Get
export const getAllWalletListApi = async (args: ToString<GetAllWalletsArgs>) => {
  const res = await walletClient.index.$get({ query: { getAll: "true", fields: "_id,name,isSaving,balance", ...args } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  const validatedData = await walletSchema.walletListData.parseAsync(resData.data);
  return validatedData;
};

//  Get Wallet List For Transfer
export const getWalletListForTransferApi = async () => {
  const res = await walletClient.index.$get({ query: { fields: "_id,name,balance", getAll: "true" } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  const parsed = await walletSchema.walletListDataForTransfer.parseAsync(resData.data);
  return parsed;
};

// Delete
export const deleteWalletApi = async (walletId: string) => {
  const res = await walletClient[":id"].$delete({ param: { id: walletId } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Transfer Wallet
export const transferWalletApi = async (payload: WalletTransferDto) => {
  const res = await walletClient.transfer.$post({ json: payload });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
