import { z } from "zod";
import { contactFormSchema } from "./contact-schema";

export type TContactForm = z.infer<typeof contactFormSchema>;
