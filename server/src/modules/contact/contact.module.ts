import { Module } from '@nestjs/common';
import { Contact, ContactSchema } from '@/schema/contact.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }])],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
