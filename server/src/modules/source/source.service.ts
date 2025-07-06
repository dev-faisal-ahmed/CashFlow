import { Source } from '@/schema/source.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SourceService {
  constructor(@InjectModel(Source.name) private sourceModel: Model<Source>) {}

  async create() {}
}
