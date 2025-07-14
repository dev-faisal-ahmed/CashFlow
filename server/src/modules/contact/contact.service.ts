import { Model } from 'mongoose';
import { Contact, ContactDocument } from '@/schema/contact.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ResponseDto } from '@/common/dto/response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CreateContactDto } from './contact.dto';
import { TQueryParams } from '@/types';
import { getMeta, getPaginationInfo, selectFields } from '@/utils';

@Injectable()
export class ContactService {
  constructor(@InjectModel(Contact.name) private contactModel: Model<ContactDocument>) {}

  async create(dto: CreateContactDto, userId: string) {
    const isContactExist = await this.contactModel.findOne({ phone: dto.phone, userId }, { _id: 1 }).lean();
    if (isContactExist) throw new BadRequestException('Contact with phone already exist!');

    await this.contactModel.create({ ...dto, userId });
    return new ResponseDto('Contact created successfully');
  }

  async getAll(query: TQueryParams, userId: string) {
    const search = query.search;
    const requestedFields = query.fields || '';
    const { page, limit, skip, getAll } = getPaginationInfo(query);

    const fields = selectFields(requestedFields, ['_id', 'name', 'phone', 'address', 'userId', 'given', 'taken']);

    const dbQuery = {
      userId,
      isDeleted: false,
      ...(search && { name: { $regex: search, $options: 'i' }, phone: { $regex: search, $options: 'i' } }),
    };

    const contacts = await this.contactModel.aggregate([
      { $match: dbQuery },

      ...(requestedFields.includes('given') || requestedFields.includes('taken')
        ? [
            {
              $lookup: {
                from: 'transactions',
                let: { contactId: '$_id' },
                pipeline: [
                  { $match: { $expr: { $and: [{ $eq: ['$type', 'BORROW_LEND'] }, { $eq: ['$contactId', '$$contactId'] }] } } },
                  { $project: { amount: 1, nature: 1 } },
                ],
                as: 'transactions',
              },
            },
            {
              $addFields: {
                given: {
                  $sum: {
                    $map: {
                      input: '$transactions',
                      as: 'tx',
                      in: { $cond: [{ $eq: ['$tx.nature', 'INCOME'] }, '$tx.amount', 0] },
                    },
                  },
                },
                taken: {
                  $sum: {
                    $map: {
                      input: '$transactions',
                      as: 'tx',
                      in: { $cond: [{ $eq: ['$tx.nature', 'EXPENSE'] }, '$tx.amount', 0] },
                    },
                  },
                },
              },
            },
            { $project: { transactions: 0 } },
          ]
        : []),

      ...(fields ? [{ $project: fields }] : []),
      ...(!getAll ? [{ $skip: skip }, { $limit: limit }] : []),
    ]);

    const total = await this.contactModel.countDocuments(dbQuery);
    const meta = getMeta({ page, limit, total });

    return new ResponseDto({ message: 'Contacts fetched successfully', meta, data: contacts });
  }
}
