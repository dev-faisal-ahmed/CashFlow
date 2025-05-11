import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonConfigService } from './config.service';

@Module({
  imports: [ConfigModule],
  providers: [CommonConfigService],
  exports: [CommonConfigService],
})
export class CommonConfigModule {}
