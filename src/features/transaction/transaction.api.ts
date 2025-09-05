import {
  CreatePeerTransactionDto,
  CreateRegularTransactionDto,
  GetPeerTransactionsArgs,
  GetRegularTransactionsArgs,
  GetTransferTransactionsArgs,
  UpdatePeerTransactionDto,
  UpdateRegularTransactionDto,
} from "@/server/modules/transaction/transaction.validation";

import { CreateTransferTransactionDto } from "@/server/modules/transaction/transaction.validation";
import { transactionClient } from "@/lib/client";
import { ToString } from "@/lib/types";

// Create Regular Transaction
export const createRegularTransactionApi = async (dto: CreateRegularTransactionDto) => {
  const res = await transactionClient.regular.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Create Peer Transaction
export const createPeerTransactionApi = async (dto: CreatePeerTransactionDto) => {
  const res = await transactionClient.peer.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Create Transfer Transaction
export const createTransferTransactionApi = async (dto: CreateTransferTransactionDto) => {
  const res = await transactionClient.transfer.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Get Regular Transactions
export const getRegularTransactionsApi = async (args: ToString<GetRegularTransactionsArgs>) => {
  const res = await transactionClient.regular.$get({ query: { ...args } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Get Peer Transactions
export const getPeerTransactionsApi = async (args: ToString<GetPeerTransactionsArgs>) => {
  const res = await transactionClient.peer.$get({ query: { ...args } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Get Transfer Transactions
export const getTransferTransactionsApi = async (args: ToString<GetTransferTransactionsArgs>) => {
  const res = await transactionClient.transfer.$get({ query: { ...args } });
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

// Update Peer Transaction
export const updatePeerTransactionApi = async ({ id, ...dto }: UpdatePeerTransactionDto & { id: string }) => {
  const res = await transactionClient.peer[":id"].$patch({ param: { id }, json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Delete Peer Transaction
export const deletePeerTransactionApi = async (id: string) => {
  const res = await transactionClient.peer[":id"].$delete({ param: { id } });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
