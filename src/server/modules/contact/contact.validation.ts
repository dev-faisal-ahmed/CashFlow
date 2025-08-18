import { capitalize } from "@/lib/utils";
import z from "zod";

const createContact = z.object({
  name: z
    .string("Name is required")
    .trim()
    .nonempty("Name can not be empty")
    .transform((v) => capitalize(v)),

  phone: z.string("Phone number is required").trim().nonempty("Phone number is required"),
  address: z.string().optional(),
});

export const contactValidation = { createContact };

export type CreateContactDto = z.infer<typeof createContact>;
