import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateContactDto } from './contact.dto';
import { User } from '@/common/decorators/user.decorator';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createContact(@Body() dto: CreateContactDto, @User('_id') userId: string) {
    return this.contactService.create(dto, userId);
  }
}
