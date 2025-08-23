import { walletClient } from "@/lib/client";
import { CreateWalletDto, GetAllWalletsArgs, WalletTransferDto } from "@/server/modules/wallet/wallet.validation";
import { ToString } from "@/lib/types";
import { IWallet } from "@/server/modules/wallet/wallet.interface";

// Add
export const addWalletApi = async (dto: CreateWalletDto) => {
  const res = await walletClient.index.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Get
type TWalletData = Pick<IWallet, "name" | "isSaving" | "balance"> & { _id: string };
export const getAllWalletListApi = async (args: ToString<GetAllWalletsArgs>) => {
  const res = await walletClient.index.$get({ query: { getAll: "true", fields: "_id,name,isSaving,balance", ...args } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData.data as TWalletData[];
};

//  Get Wallet List For Transfer
type TWalletWithBasicInfo = Pick<IWallet, "name" | "balance"> & { _id: string };
export const getWalletListWithBasicDataApi = async (args: ToString<GetAllWalletsArgs>) => {
  const res = await walletClient.index.$get({ query: { fields: "_id,name,balance", getAll: "true", ...args } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData.data as TWalletWithBasicInfo[];
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
