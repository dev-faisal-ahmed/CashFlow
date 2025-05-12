import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.modules';
import { ConfigModule } from '@nestjs/config';
import { mongoConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [mongoConfig] }),
    MongooseModule.forRootAsync({ useFactory: mongoConfig }),
    AuthModule,
  ],
})
export class AppModule {}
