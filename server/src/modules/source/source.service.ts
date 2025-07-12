import { getMeta, getPaginationInfo, selectFields } from '@/utils';
import { Source, SourceDocument, SourceType } from '@/schema/source.schema';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSourceDto, UpdateSourceDto } from './source.dto';
import { ResponseDto } from '@/common/dto/response.dto';
import { TQueryParams } from '@/types';
import { Model, Types } from 'mongoose';

@Injectable()
export class SourceService {
  constructor(@InjectModel(Source.name) private sourceModel: Model<SourceDocument>) {}

  async create(dto: CreateSourceDto, userId: string) {
    const isSourceExist = await this.sourceModel.findOne({ name: dto.name, userId }, '_id').lean();
    if (isSourceExist) throw new BadRequestException('Source with name already exists!');

    await this.sourceModel.create({ ...dto, userId });
    return new ResponseDto('Source created successfully');
  }

  async getAll(query: TQueryParams, userId: string) {
    const search = query.search;
    const requestedFields = query.fields;
    const { getAll, limit, page, skip } = getPaginationInfo(query);
    const now = new Date();

    const fields = selectFields(requestedFields, ['_id', 'name', 'type', 'budget', 'income', 'expense']);
    const dbQuery = { isDeleted: false, userId, ...(search && { name: { $regex: search, $options: 'i' } }) };

    const sources = await this.sourceModel.aggregate([
      { $match: dbQuery },

      // adding this stage when user needs income or expense
      ...(requestedFields.includes('income') || requestedFields.includes('expense')
        ? [
            { $addFields: { now: now, interval: { $ifNull: ['$budget.interval', 'MONTHLY'] } } },

            {
              $addFields: {
                startDate: {
                  $switch: {
                    branches: [
                      {
                        case: { $eq: ['$interval', 'WEEKLY'] },
                        then: { $dateTrunc: { date: '$now', unit: 'week', binSize: 1 } },
                      },
                      {
                        case: { $eq: ['$interval', 'MONTHLY'] },
                        then: { $dateTrunc: { date: '$now', unit: 'month', binSize: 1 } },
                      },
                      {
                        case: { $eq: ['$interval', 'YEARLY'] },
                        then: { $dateTrunc: { date: '$now', unit: 'year', binSize: 1 } },
                      },
                      {
                        case: { $eq: ['$interval', 'YEARLY'] },
                        then: { $dateTrunc: { date: '$now', unit: 'year', binSize: 1 } },
                      },
                    ],

                    default: { $dateTrunc: { date: '$now', unit: 'month', binSize: 1 } },
                  },
                },
              },
            },

            {
              $lookup: {
                from: 'transactions',
                let: { sourceId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$type', 'REGULAR'] },
                          { $eq: ['$sourceId', '$$sourceId'] },
                          { $gte: ['$date', '$startDate'] },
                          { $lte: ['$date', '$now'] },
                          { $in: ['$nature', ['INCOME', 'EXPENSE']] },
                        ],
                      },
                    },
                  },
                  { $project: { amount: 1, nature: 1 } },
                ],
                as: 'transactions',
              },
            },

            // adding stage when user asks for income
            ...(requestedFields.includes('income')
              ? [
                  {
                    $addFields: {
                      income: {
                        $sum: {
                          $map: {
                            input: '$transactions',
                            as: 'tx',
                            in: { $cond: [{ $eq: ['$$tx.nature', 'INCOME'] }, '$$tx.amount', 0] },
                          },
                        },
                      },
                    },
                  },
                ]
              : []),

            // adding stage when user asks for expense
            ...(requestedFields.includes('expense')
              ? [
                  {
                    $addFields: {
                      expense: {
                        $sum: {
                          $map: {
                            input: '$transactions',
                            as: 'tx',
                            in: { $cond: [{ $eq: ['$$tx.nature', 'EXPENSE'] }, '$$tx.amount', 0] },
                          },
                        },
                      },
                    },
                  },
                ]
              : []),

            { $project: { transactions: 0 } },
          ]
        : []),

      ...(fields ? [{ $project: fields }] : []),
      ...(!getAll ? [{ $skip: skip }, { $limit: limit }] : []),
    ]);

    const total = await this.sourceModel.countDocuments(dbQuery);
    const meta = getMeta({ page, limit, total });

    return new ResponseDto({ message: 'Sources fetched successfully', meta, data: sources });
  }

  async updateOne(dto: UpdateSourceDto, sourceId: string, userId: string) {
    const source = await this.sourceModel.findOne({ _id: sourceId }, '_id userId type budget').lean();
    if (!source) throw new NotFoundException('Source not found!');

    const isOwner = source.userId.equals(new Types.ObjectId(userId));
    if (!isOwner) throw new UnauthorizedException('You are not authorized to update this source');
    if (source.type !== SourceType.EXPENSE && dto.budget) throw new BadRequestException('Budget is not allowed for Income source');

    const { name, budget, addBudget } = dto;

    await this.sourceModel.updateOne(
      { _id: sourceId },
      {
        $set: { ...(name && { name }), ...(addBudget && budget && { budget }) },
        ...(!addBudget && source.budget && { $unset: { budget: 1 } }),
      },
    );

    return new ResponseDto('Source updated successfully');
  }

  async deleteOne(sourceId: string, userId: string) {
    const isOwner = await this.isOwner(sourceId, userId);
    if (!isOwner) throw new UnauthorizedException('You are not authorized to delete this source');

    await this.sourceModel.updateOne({ _id: sourceId }, { $set: { isDeleted: true } });
    return new ResponseDto('Source deleted successfully');
  }

  // helper
  async isOwner(sourceId: string, userId: string) {
    const source = await this.sourceModel.findOne({ _id: sourceId }, '_id userId').lean();
    if (!source) throw new NotFoundException('Source not found!');
    return source.userId.equals(new Types.ObjectId(userId));
  }
}
