import { authGuard } from "@/server/middlewares/auth.guard";
import { jsonValidator } from "@/server/middlewares/validator";
import { Hono } from "hono";
import { contactValidation } from "./contact.validation";
import { ContactService } from "./contact.service";
import { ResponseDto } from "@/server/core/response.dto";

const contactService = new ContactService();

export const contactRoute = new Hono().post("/", authGuard, jsonValidator(contactValidation.createContact), async (ctx) => {
  const user = ctx.get("user");
  const dto = ctx.req.valid("json");
  await contactService.createContact({ ...dto, userId: user._id });
  return ctx.json(ResponseDto.success("Contact created successfully"));
});

export type TContactRoute = typeof contactRoute;
