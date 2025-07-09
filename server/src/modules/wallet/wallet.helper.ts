import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletHelper {
  buildBalancePipeline() {
    return [
      // Basic transactions
      {
        $lookup: {
          from: 'transactions',
          let: { walletId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$walletId', '$$walletId'] }, { $in: ['$type', ['INITIAL', 'REGULAR', 'BORROW_LEND']] }] } } },
            { $project: { amount: 1, nature: 1 } },
          ],
          as: 'basicTransactions',
        },
      },

      // Transfer IN
      {
        $lookup: {
          from: 'transactions',
          let: { walletId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$destinationWalletId', '$$walletId'] }, { $eq: ['$type', 'TRANSFER'] }] } } },
            { $project: { amount: 1, nature: { $literal: 'INCOME' } } },
          ],
          as: 'incomeTransfers',
        },
      },

      // Transfer Out
      {
        $lookup: {
          from: 'transactions',
          let: { walletId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$sourceWalletId', '$$walletId'] }, { $eq: ['$type', 'TRANSFER'] }] } } },
            { $project: { amount: 1, nature: { $literal: 'EXPENSE' } } },
          ],
          as: 'expenseTransfers',
        },
      },

      { $addFields: { allTransactions: { $concatArrays: ['$basicTransactions', '$incomeTransfers', '$expenseTransfers'] } } },
      {
        $addFields: {
          balance: {
            $sum: {
              $map: {
                input: '$allTransactions',
                as: 'tx',
                in: { $cond: [{ $eq: ['$$tx.nature', 'INCOME'] }, '$$tx.amount', { $multiply: ['$$tx.amount', -1] }] },
              },
            },
          },
        },
      },
      { $project: { basicTransactions: 0, incomeTransfers: 0, expenseTransfers: 0, allTransactions: 0 } },
    ];
  }
}
