import { ContentfulStatusCode } from "hono/utils/http-status";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: ContentfulStatusCode = 400,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}
