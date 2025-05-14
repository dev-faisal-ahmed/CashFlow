import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from '@nestjs/common';

import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const message = exception.message;
    const error = undefined;

    const responseBody = {
      ok: false,
      message: message || 'Something went wrong',
      error,
    };

    response.status(status).json(responseBody);
  }
}
