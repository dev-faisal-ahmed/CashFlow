import z from "zod";

import { FC } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldForm } from "@/components/shared/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { capitalize } from "@/lib/utils";

// Shared Types
export type TContactFormData = z.infer<typeof contactFormSchema>;

// Main : Contact Form
type ContactFormProps = {
  formId: string;
  defaultValues: TContactFormData;
  onSubmit: (formData: TContactFormData, onReset: () => void) => void;
  mode: "add" | "edit";
};

export const ContactForm: FC<ContactFormProps> = ({ formId, defaultValues, onSubmit, mode }) => {
  const form = useForm<TContactFormData>({ resolver: zodResolver(contactFormSchema), defaultValues });
  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

  return (
    <Form {...form}>
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <FieldForm control={form.control} name="name" label="Contact Name">
          {({ field }) => <Input {...field} placeholder="@: John Doe" />}
        </FieldForm>

        <FieldForm control={form.control} name="phone" label="Phone Number" disabled={mode === "edit"}>
          {({ field }) => <Input {...field} placeholder="@: +8801234567890" />}
        </FieldForm>

        <FieldForm control={form.control} name="address" label="Address">
          {({ field }) => <Textarea {...field} placeholder="@: 123 Main Street" />}
        </FieldForm>
      </form>
    </Form>
  );
};

// Schemas
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Name can not be empty")
    .transform((value) => capitalize(value)),

  phone: z
    .string()
    .trim()
    .nonempty("Phone can not be empty")
    .regex(/^\+?[0-9]{5,20}$/, "Invalid phone number"),

  address: z.string().trim().optional(),
});
