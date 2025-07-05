import { TPromiseResponse, TQuery, TWallet } from "@/lib/types";
import { TUpdateWalletForm, TWalletForm } from "./wallet-type";
import { apiUrl } from "@/lib/api-url";
import { api } from "@/lib/api";
import { buildQueryString } from "@/lib/utils";

export const addWallet = async (payload: TAddWalletPayload): TPromiseResponse => {
  const { data } = await api.post(apiUrl.wallet.addWallet, payload);
  return data;
};

export const getWalletList = async (args: TQuery = {}): TPromiseResponse<TGetWalletListResponse> => {
  const queryString = buildQueryString({ ...args, fields: "_id,name,isSaving,members,balance,membersCount" });
  const url = apiUrl.wallet.getWallets(queryString);

  const { data } = await api.get(url);
  return data;
};

export const updateWallet = async ({ walletId, ...payload }: TUpdateWalletPayload): TPromiseResponse => {
  const url = apiUrl.wallet.updateWallet(walletId);

  const { data } = await api.patch(url, payload);
  return data;
};

type TAddWalletPayload = TWalletForm;
type TGetWalletListResponse = Array<Pick<TWallet, "_id" | "name" | "isSaving"> & { balance: number }>;
type TUpdateWalletPayload = TUpdateWalletForm & { walletId: string };
