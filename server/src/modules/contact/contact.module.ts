import { Module } from '@nestjs/common';
import { Contact, ContactSchema } from '@/schema/contact.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtSharedModule } from '@/shared/jwt/jwt.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]), AuthModule, JwtSharedModule],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
