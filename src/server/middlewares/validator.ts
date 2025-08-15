import { ZodType } from "zod";
import { validator } from "hono/validator";

export const jsonValidator = <TSchema extends ZodType>(schema: TSchema) => {
  return validator("json", async (value) => {
    const parsed = await schema.parseAsync(value);
    return parsed;
  });
};

export const queryValidator = <TSchema extends ZodType>(schema: TSchema) => {
  return validator("query", async (value) => {
    const parsed = schema.parseAsync(value);
    return parsed;
  });
};
