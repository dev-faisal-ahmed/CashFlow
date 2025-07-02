import { TPromiseResponse, TQuery, TWallet } from "@/lib/types";
import { TWalletForm } from "./wallet-type";
import { apiUrl } from "@/lib/api-url";
import { api } from "@/lib/api";
import { buildQueryString } from "@/lib/utils";

export const addWallet = async (payload: TAddWalletPayload): TPromiseResponse => {
  const { data } = await api.post(apiUrl.wallet.addWallet, payload);
  return data;
};

export const getWalletList = async (args: TQuery = {}): TPromiseResponse<GetWalletListResponse> => {
  const queryString = buildQueryString({ ...args, fields: "_id,name,isSaving,members,balance" });
  const url = apiUrl.wallet.getWallets(queryString);

  const { data } = await api.get(url);
  return data;
};

type TAddWalletPayload = TWalletForm;
type GetWalletListResponse = Array<Pick<TWallet, "_id" | "name" | "isSaving"> & { balance: number }>;
