import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateContactDto } from './contact.dto';
import { User } from '@/common/decorators/user.decorator';
import { TQueryParams } from '@/types';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createContact(@Body() dto: CreateContactDto, @User('_id') userId: string) {
    return this.contactService.create(dto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllContacts(@Query() query: TQueryParams, @User('_id') userId: string) {
    return this.contactService.getAll(query, userId);
  }
}
