import { ETransactionNature, ETransactionType } from "../transaction/transaction.interface";

export class WalletHelper {
  buildBalancePipeline() {
    return [
      // Basic transactions
      {
        $lookup: {
          from: "transactions",
          let: { walletId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$walletId", "$$walletId"] },
                    { $in: ["$type", [ETransactionType.initial, ETransactionType.regular, ETransactionType.peerTransfer]] },
                  ],
                },
              },
            },
            { $project: { amount: 1, nature: 1 } },
          ],
          as: "basicTransactions",
        },
      },

      // Transfer IN
      {
        $lookup: {
          from: "transactions",
          let: { walletId: "$_id" },
          pipeline: [
            {
              $match: { $expr: { $and: [{ $eq: ["$destinationWalletId", "$$walletId"] }, { $eq: ["$type", ETransactionType.transfer] }] } },
            },
            { $project: { amount: 1, nature: { $literal: "income" } } },
          ],
          as: "incomeTransfers",
        },
      },

      // Transfer Out
      {
        $lookup: {
          from: "transactions",
          let: { walletId: "$_id" },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ["$sourceWalletId", "$$walletId"] }, { $eq: ["$type", ETransactionType.transfer] }] } } },
            { $project: { amount: 1, nature: { $literal: "expense" } } },
          ],
          as: "expenseTransfers",
        },
      },

      { $addFields: { allTransactions: { $concatArrays: ["$basicTransactions", "$incomeTransfers", "$expenseTransfers"] } } },
      {
        $addFields: {
          balance: {
            $sum: {
              $map: {
                input: "$allTransactions",
                as: "tx",
                in: { $cond: [{ $eq: ["$$tx.nature", ETransactionNature.income] }, "$$tx.amount", { $multiply: ["$$tx.amount", -1] }] },
              },
            },
          },
        },
      },

      { $project: { basicTransactions: 0, incomeTransfers: 0, expenseTransfers: 0, allTransactions: 0 } },
    ];
  }
}
