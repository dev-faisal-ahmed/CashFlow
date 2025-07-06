import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateSourceDto } from './source.dto';
import { User } from '@/common/decorators/user.decorator';
import { SourceService } from './source.service';

@Controller("/sources")
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createSource(@Body() dto: CreateSourceDto, @User('_id') userId: string) {
    return this.sourceService.create(dto, userId);
  }
}
