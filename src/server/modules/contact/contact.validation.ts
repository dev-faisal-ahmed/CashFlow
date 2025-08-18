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

const updateContact = z.object({
  name: z
    .string()
    .trim()
    .nonempty()
    .transform((v) => capitalize(v))
    .optional(),

  address: z.string().trim().optional(),
});

// Query
const getContacts = commonValidation.queryWithPagination;

export const contactValidation = { createContact, getContacts, updateContact };

export type CreateContactDto = z.infer<typeof createContact>;
export type GetContactsArgs = z.infer<typeof getContacts>;
export type UpdateContactDto = z.infer<typeof updateContact>;
