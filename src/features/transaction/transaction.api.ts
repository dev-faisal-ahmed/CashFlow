import {
  CreatePeerTransactionDto,
  CreateRegularTransactionDto,
  GetRegularTransactionsArgs,
  UpdateRegularTransactionDto,
} from "@/server/modules/transaction/transaction.validation";

import { transactionClient } from "@/lib/client";
import { ToString } from "@/lib/types";

// Create Regular Transaction
export const createRegularTransactionApi = async (dto: CreateRegularTransactionDto) => {
  const res = await transactionClient.regular.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

export const createPeerTransactionApi = async (dto: CreatePeerTransactionDto) => {
  const res = await transactionClient.peer.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

export const getRegularTransactionsApi = async (args: ToString<GetRegularTransactionsArgs>) => {
  const res = await transactionClient.regular.$get({ query: { ...args } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Update Regular Transaction
export const updateRegularTransactionApi = async ({ id, ...dto }: UpdateRegularTransactionDto & { id: string }) => {
  const res = await transactionClient.regular[":id"].$patch({ param: { id }, json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Delete Regular Transaction
export const deleteRegularTransactionApi = async (id: string) => {
  const res = await transactionClient.regular[":id"].$delete({ param: { id } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
