import util from "util";

import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { AppError } from "./app.error";
import { ResponseDto } from "./response.dto";
import { ZodError } from "zod";

export class GlobalErrorHandler {
  private status: ContentfulStatusCode;
  private message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private error: any;

  constructor(error: unknown) {
    this.status = 500;
    this.message = "Something went wrong";
    this.error = error;
  }

  public handle(ctx: Context) {
    console.log(util.inspect(this.error, { showHidden: false, depth: null, colors: true }));

    const error = this.error;

    // Zod Validation Handler
    if (error.name === "ZodError") this.handleZodValidationError();
    // Mongo Duplicate Error
    else if (error.code === 11000) this.handleMongoDuplicateError();
    // App Error
    else if (error instanceof AppError) void this.handleAppError();
    // Error
    else if (error instanceof Error) void this.handleError();

    // sending response
    return ctx.json(ResponseDto.error(this.message), this.status);
  }

  // helpers
  private handleZodValidationError() {
    const error = this.error as ZodError;
    this.message = error.issues.map((issue) => issue.message).join(" |");
  }

  private handleMongoDuplicateError() {
    const fields = Object.keys(this.error.keyValue ?? {});
    this.message = fields.map((field) => `${this.capitalize(field)} already exist`).join(" |") ?? "Duplicate key error";
    this.status = 409;
  }

  private handleAppError() {
    this.message = this.error.message;
    this.status = this.error.statusCode;
  }

  private handleError() {
    this.message = this.error.message;
  }

  private capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export const handleGlobalError = (error: unknown, ctx: Context) => {
  const globalErrorHandler = new GlobalErrorHandler(error);
  return globalErrorHandler.handle(ctx);
};
