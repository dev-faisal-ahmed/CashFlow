import { capitalize } from "@/lib/utils";
import { z } from "zod";

// Form
const contact = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Name can not be empty")
    .transform((value) => capitalize(value)),

  phone: z.string().trim().nonempty("Phone can not be empty"),
  address: z.string().trim().optional(),
});

// Api Response
const getContacts = z.array(
  z.object({
    _id: z.string(),
    name: z.string(),
    phone: z.string(),
    address: z.string().optional(),
    given: z.number(),
    taken: z.number(),
  }),
);

export const contactSchema = {
  // Form
  contact,

  //Api Response
  getContacts,
};

export type TContactFormData = z.infer<typeof contact>;
