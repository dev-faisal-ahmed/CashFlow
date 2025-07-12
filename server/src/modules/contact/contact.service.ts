import { Model } from 'mongoose';
import { Contact, ContactDocument } from '@/schema/contact.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ResponseDto } from '@/common/dto/response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CreateContactDto } from './contact.dto';

@Injectable()
export class ContactService {
  constructor(@InjectModel(Contact.name) private contactModel: Model<ContactDocument>) {}

  async create(dto: CreateContactDto, userId: string) {
    const isContactExist = await this.contactModel.findOne({ phone: dto.phone, userId }, { _id: 1 }).lean();
    if (isContactExist) throw new BadRequestException('Contact with phone already exist!');

    await this.contactModel.create({ ...dto, userId });
    return new ResponseDto('Contact created successfully');
  }
}
