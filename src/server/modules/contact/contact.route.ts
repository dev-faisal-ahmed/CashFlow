import { authGuard } from "@/server/middlewares/auth.guard";
import { jsonValidator, queryValidator } from "@/server/middlewares/validator";
import { Hono } from "hono";
import { contactValidation } from "./contact.validation";
import { ContactService } from "./contact.service";
import { ResponseDto } from "@/server/core/response.dto";

const contactService = new ContactService();

export const contactRoute = new Hono()
  // Create Contacts
  .post("/", authGuard, jsonValidator(contactValidation.createContact), async (ctx) => {
    const user = ctx.get("user");
    const dto = ctx.req.valid("json");
    await contactService.createContact({ ...dto, userId: user._id });
    return ctx.json(ResponseDto.success("Contact created successfully"));
  })

  // Get Contacts
  .get("/", authGuard, queryValidator(contactValidation.getContacts), async (ctx) => {
    const user = ctx.get("user");
    const query = ctx.req.valid("query");
    const { contacts, meta } = await contactService.getContacts(query, user._id);
    return ctx.json(ResponseDto.success({ message: "Contacts fetched successfully", meta, data: contacts }));
  })

  // Update Contact
  .patch("/:id", authGuard, jsonValidator(contactValidation.updateContact), async (ctx) => {
    const user = ctx.get("user");
    const dto = ctx.req.valid("json");
    const id = ctx.req.param("id");
    await contactService.updateContact(dto, id, user._id);
    return ctx.json(ResponseDto.success("Contact updated successfully"));
  })

  // Delete Contact
  .delete("/:id", authGuard, async (ctx) => {
    const user = ctx.get("user");
    const id = ctx.req.param("id");
    await contactService.deleteContact(id, user._id);
    return ctx.json(ResponseDto.success("Contact deleted successfully"));
  });

export type TContactRoute = typeof contactRoute;
