import { walletClient } from "@/lib/client";
import { CreateWalletDto, GetAllWalletsArgs } from "@/server/modules/wallet/wallet.validation";
import { ToString } from "@/lib/types";

// Add
export const addWalletApi = async (dto: CreateWalletDto) => {
  const res = await walletClient.index.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Get
export const getAllWalletListApi = async (args: ToString<GetAllWalletsArgs> = {}) => {
  const res = await walletClient.index.$get({ query: { ...args } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData.data;
};

//  Get Wallet List For Transfer
export const getWalletListWithBasicDataApi = async (args: ToString<GetAllWalletsArgs>) => {
  const res = await walletClient.index.$get({ query: { ...args } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData.data;
};

// Delete
export const deleteWalletApi = async (walletId: string) => {
  const res = await walletClient[":id"].$delete({ param: { id: walletId } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
