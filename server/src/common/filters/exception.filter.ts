import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    console.log(exception);

    const errorResponse = exception.getResponse() as { message: string[] };
    const message = errorResponse.message.toString();

    const responseBody = { ok: false, message: message || 'Something went wrong' };
    response.status(status).json(responseBody);
  }
}
