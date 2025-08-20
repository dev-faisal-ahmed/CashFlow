import { FC } from "react";
import { Form } from "@/components/ui/form";
import { FieldForm } from "@/components/shared/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "../contact.hooks";
import { TContactFormData } from "../contact.schema";

// Main : Contact Form
type ContactFormProps = {
  formId: string;
  defaultValues: TContactFormData;
  onSubmit: (formData: TContactFormData, onReset: () => void) => void;
  mode: "add" | "edit";
};

export const ContactForm: FC<ContactFormProps> = ({ formId, defaultValues, onSubmit, mode }) => {
  const { form, handleSubmit } = useContactForm(defaultValues, onSubmit);

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
