import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodSchema<T>) {}

  transform(value: any) {
    const result = this.schema.safeParse(value);

    if (!result.success) throw new BadRequestException(this.formatError(result.error));

    return result.data;
  }

  private formatError(error: ZodError) {
    return error.errors.map((error) => error.message).join(', ');
  }
}
