import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';

import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let message = exception.message;
    let error = undefined;

    if (exception instanceof BadRequestException) {
      const response = exception.getResponse() as { message: string[] };
      message = response?.message.join(', ');
      error = undefined;
    }

    const responseBody = {
      ok: false,
      message: message || 'Something went wrong',
      error,
    };

    response.status(status).json(responseBody);
  }
}
