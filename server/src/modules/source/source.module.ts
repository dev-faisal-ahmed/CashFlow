import { Source, SourceSchema } from '@/schema/source.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SourceService } from './source.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Source.name, schema: SourceSchema }])],
  providers: [SourceService],
  exports: [SourceService],
  controllers: [],
})
export class SourceModule {}
