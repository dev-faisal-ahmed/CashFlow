import { TPromiseResponse, TQuery, TWallet } from "@/lib/types";
import { TUpdateWalletForm, TWalletForm } from "./wallet-type";
import { apiUrl } from "@/lib/api-url";
import { buildQueryString } from "@/lib/utils";
import { api } from "@/lib/api";

export const addWallet = async (payload: TAddWalletPayload): TPromiseResponse => {
  const { data } = await api.post(apiUrl.wallet.add, payload);
  return data;
};

export const getWalletList = async (args: TQuery = {}): TPromiseResponse<TGetWalletListResponse> => {
  const queryString = buildQueryString({ ...args, fields: "_id,name,isSaving,members,balance,membersCount" });
  const url = apiUrl.wallet.getAll(queryString);
  const { data } = await api.get(url);
  return data;
};

export const updateWallet = async ({ walletId, ...payload }: TUpdateWalletPayload): TPromiseResponse => {
  const url = apiUrl.wallet.update(walletId);
  const { data } = await api.patch(url, payload);
  return data;
};

export const deleteWallet = async (walletId: string): TPromiseResponse => {
  const url = apiUrl.wallet.delete(walletId);
  const { data } = await api.delete(url);
  return data;
};

export const transferWallet = async (payload: TTransferWalletPayload): TPromiseResponse => {
  const { data } = await api.post(apiUrl.transactions.transfer, payload);
  return data;
};

export const getWalletListForTransfer = async (): TPromiseResponse<TGetWalletListForTransferResponse> => {
  const queryString = buildQueryString({ isSaving: "false", fields: "_id,name", getAll: "true" });
  const url = apiUrl.wallet.getAll(queryString);
  const { data } = await api.get(url);
  return data;
};

type TAddWalletPayload = TWalletForm;
type TGetWalletListResponse = Array<Pick<TWallet, "_id" | "name" | "isSaving"> & { balance: number }>;
type TUpdateWalletPayload = TUpdateWalletForm & { walletId: string };
type TTransferWalletPayload = { amount: number; description: string; sourceWalletId: string; destinationWalletId: string };
type TGetWalletListForTransferResponse = Array<Pick<TWallet, "_id" | "name">>;
