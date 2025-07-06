import { Source, SourceSchema } from '@/schema/source.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SourceService } from './source.service';
import { SourceController } from './source.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Source.name, schema: SourceSchema }])],
  providers: [SourceService],
  controllers: [SourceController],
})
export class SourceModule {}
