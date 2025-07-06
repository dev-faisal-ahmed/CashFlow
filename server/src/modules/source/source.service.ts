import { Source } from '@/schema/source.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSourceDto } from './source.dto';
import { ResponseDto } from '@/common/dto/response.dto';
import { TQueryParams } from '@/types';
import { getMeta, getPaginationInfo, selectFields } from '@/utils';

@Injectable()
export class SourceService {
  constructor(@InjectModel(Source.name) private sourceModel: Model<Source>) {}

  async create(dto: CreateSourceDto, userId: string) {
    const isSourceExist = await this.sourceModel.findOne({ name: dto.name, userId }, '_id').lean();
    if (isSourceExist) throw new BadRequestException('Source with name already exists!');

    await this.sourceModel.create({ ...dto, userId });
    return new ResponseDto({ message: 'Source created successfully' });
  }

  async getAll(query: TQueryParams, userId: string) {
    const search = query.search;
    const requestedFields = query.fields;
    const { getAll, limit, page, skip } = getPaginationInfo(query);

    const fields = selectFields(requestedFields, ['_id', 'name', "budget", ]);
    const dbQuery = {isDeleted: false, userId, ...(search && { name: { $regex: search, $options: 'i' } })}

    const sources = await this.sourceModel.aggregate([
      { $match: dbQuery },
      ...(fields ? [{ $project: fields }] : []),
      ...(!getAll ? [{ $skip: skip }, { $limit: limit }] : []),
    ]);

    const total = await this.sourceModel.countDocuments(dbQuery);
    const meta = getMeta({ page, limit, total });

    return new ResponseDto({ message: 'Sources fetched successfully', data: sources, meta });
  }
}
