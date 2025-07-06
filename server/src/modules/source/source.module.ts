import { Source, SourceSchema } from '@/schema/source.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SourceService } from './source.service';
import { SourceController } from './source.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtSharedModule } from '@/shared/jwt/jwt.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Source.name, schema: SourceSchema }]), AuthModule, JwtSharedModule],
  providers: [SourceService],
  controllers: [SourceController],
})
export class SourceModule {}
