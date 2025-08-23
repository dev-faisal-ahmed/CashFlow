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

export const contactSchema = {
  // Form
  contact,
};

export type TContactFormData = z.infer<typeof contact>;
