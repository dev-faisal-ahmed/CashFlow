import { ZodType } from "zod";
import { validator } from "hono/validator";
import { AppError } from "../core/app.error";

export const jsonValidator = <TSchema extends ZodType>(schema: TSchema) => {
  return validator("json", (value) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) throw new AppError(parsed.error.issues.map((issue) => issue.message).join(" |"));
    return parsed.data;
  });
};

export const queryValidator = <TSchema extends ZodType>(schema: TSchema) => {
  return validator("query", (value) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) throw new AppError(parsed.error.issues.map((issue) => issue.message).join(" |"));
    return parsed.data;
  });
};
