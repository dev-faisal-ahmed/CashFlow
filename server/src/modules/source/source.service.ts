import { Source } from '@/schema/source.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSourceDto } from './source.dto';
import { ResponseDto } from '@/common/dto/response.dto';

@Injectable()
export class SourceService {
  constructor(@InjectModel(Source.name) private sourceModel: Model<Source>) {}

  async create(dto: CreateSourceDto, userId: string) {
    const isSourceExist = await this.sourceModel.findOne({ name: dto.name, userId }, '_id').lean();
    if (isSourceExist) throw new BadRequestException('Source with name already exists!');

    await this.sourceModel.create(dto);
    return new ResponseDto('Source created successfully');
  }
}
