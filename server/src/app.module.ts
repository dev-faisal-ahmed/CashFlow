import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.modules';
import { ConfigModule } from '@nestjs/config';
import { CommonConfigService } from './common/config/config.service';
import { CommonConfigModule } from './common/config/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonConfigModule,
    MongooseModule.forRootAsync({
      imports: [CommonConfigModule],
      inject: [CommonConfigService],
      useFactory: (configService: CommonConfigService) => ({
        uri: configService.getMongoUri(),
      }),
    }),
    AuthModule,
  ],
})
export class AppModule {}
