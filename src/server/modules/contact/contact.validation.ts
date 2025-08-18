import { capitalize } from "@/lib/utils";
import { commonValidation } from "@/server/common/validation";
import z from "zod";

// Json
const createContact = z.object({
  name: z
    .string("Name is required")
    .trim()
    .nonempty("Name can not be empty")
    .transform((v) => capitalize(v)),

  phone: z.string("Phone number is required").trim().nonempty("Phone number is required"),
  address: z.string().optional(),
});

// Query
const getContacts = commonValidation.queryWithPagination;

export const contactValidation = { createContact, getContacts };

export type CreateContactDto = z.infer<typeof createContact>;
export type GetContactsArgs = z.infer<typeof getContacts>;
