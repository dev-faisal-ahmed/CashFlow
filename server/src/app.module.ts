import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { MONGO_URI } from './config';

@Module({
  imports: [MongooseModule.forRoot(MONGO_URI!), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
