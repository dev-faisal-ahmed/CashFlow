import { transactionClient } from "@/lib/client";
import { ToString } from "@/lib/types";
import { IRegularTransaction } from "@/server/modules/transaction/transaction.interface";
import { CreateRegularTransactionDto, GetTransactionsArgs } from "@/server/modules/transaction/transaction.validation";

// Create Regular Transaction
export const createRegularTransactionApi = async (dto: CreateRegularTransactionDto) => {
  const res = await transactionClient.regular.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};

// Get Regular Transactions
type TRegularTransaction = Pick<IRegularTransaction, "_id" | "amount" | "description" | "nature" | "date"> & {
  walletName: string;
  sourceName: string;
};

export const getRegularTransactionsApi = async (args: ToString<GetTransactionsArgs>) => {
  const res = await transactionClient.regular.$get({
    query: { ...args, fields: "_id,amount,description,nature,date,walletName,sourceName" },
  });

  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  const transactions = resData.data as TRegularTransaction[];
  return { transactions, meta: resData.meta };
};
