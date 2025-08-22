import { transactionClient } from "@/lib/client";
import { CreateRegularTransactionDto } from "@/server/modules/transaction/transaction.validation";

export const createRegularTransactionApi = async (dto: CreateRegularTransactionDto) => {
  const res = await transactionClient.regular.$post({ json: dto });
  const resData = await res.json();
  if (!resData.success) throw new Error(resData.message);
  return resData;
};
