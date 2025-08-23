import { authGuard } from "@/server/middlewares/auth.guard";
import { jsonValidator, queryValidator } from "@/server/middlewares/validator";
import { Hono } from "hono";
import { contactValidation } from "./contact.validation";
import { ContactService } from "./contact.service";
import { ResponseDto } from "@/server/core/response.dto";

export const contactRoute = new Hono()
  // Create Contacts
  .post("/", authGuard, jsonValidator(contactValidation.createContact), async (ctx) => {
    const user = ctx.get("user");
    const dto = ctx.req.valid("json");
    await ContactService.createContact({ ...dto, userId: user.id });
    return ctx.json(ResponseDto.success("Contact created successfully"));
  })

  // Get Contacts
  .get("/", authGuard, queryValidator(contactValidation.getContacts), async (ctx) => {
    const user = ctx.get("user");
    const query = ctx.req.valid("query");
    const { contacts, meta } = await ContactService.getContacts({ query, userId: user.id });
    return ctx.json(ResponseDto.success({ message: "Contacts fetched successfully", meta, data: contacts }));
  })

  // Update Contact
  .patch("/:id", authGuard, jsonValidator(contactValidation.updateContact), async (ctx) => {
    const user = ctx.get("user");
    const dto = ctx.req.valid("json");
    const id = ctx.req.param("id");
    await ContactService.updateContact({ id: Number(id), dto, userId: user.id });
    return ctx.json(ResponseDto.success("Contact updated successfully"));
  })

  // Delete Contact
  .delete("/:id", authGuard, async (ctx) => {
    const user = ctx.get("user");
    const id = ctx.req.param("id");
    await ContactService.deleteContact({ id: Number(id), userId: user.id });
    return ctx.json(ResponseDto.success("Contact deleted successfully"));
  });

export type TContactRoute = typeof contactRoute;
