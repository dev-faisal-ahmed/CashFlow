import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class CommonConfigService {
  constructor(private readonly configService: NestConfigService) {}

  getMongoUri() {
    return this.configService.get('MONGO_URI') as string;
  }

  getHashSalt() {
    return Number(this.configService.get('HASH_SALT'));
  }
}
