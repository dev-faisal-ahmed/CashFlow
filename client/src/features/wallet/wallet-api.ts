import { TPromiseResponse } from "@/lib/types";
import { TWalletForm } from "./wallet-type";
import { apiUrl } from "@/lib/api-url";
import { api } from "@/lib/api";

export const addWallet = async (payload: TAddWalletPayload): TPromiseResponse => {
  const { data } = await api.post(apiUrl.wallet.addWallet, payload);
  return data;
};

type TAddWalletPayload = TWalletForm;
