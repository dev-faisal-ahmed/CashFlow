import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateSourceDto, UpdateSourceNameDto } from './source.dto';
import { User } from '@/common/decorators/user.decorator';
import { SourceService } from './source.service';
import { TQueryParams } from '@/types';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('/sources')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createSource(@Body() dto: CreateSourceDto, @User('_id') userId: string) {
    return this.sourceService.create(dto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllSources(@Query() query: TQueryParams, @User('_id') userId: string) {
    return this.sourceService.getAll(query, userId);
  }

  @Patch(':sourceId')
  @UseGuards(AuthGuard)
  async updateSourceName(@Body() dto: UpdateSourceNameDto, @Param('sourceId', ParseObjectIdPipe) sourceId: string, @User('_id') userId: string) {
    return this.sourceService.updateName(dto, sourceId, userId);
  }
}
