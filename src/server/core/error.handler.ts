import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { AppError } from "./app.error";
import { ResponseDto } from "./response.dto";

export const errorHandler = (error: unknown, ctx: Context) => {
  console.log(error);

  let status: ContentfulStatusCode = 500;
  let message = "Something went wrong";

  // App Error
  if (error instanceof AppError) {
    message = error.message;
    status = error.statusCode;
  }
  // Error
  else if (error instanceof Error) message = error.message;

  return ctx.json(ResponseDto.error(message), status);
};
