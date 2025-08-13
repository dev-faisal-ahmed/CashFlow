import { FC } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { TContactForm } from "../contact-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "../contact-schema";
import { FieldForm } from "@/components/shared/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  formId: string;
  defaultValues: TContactForm;
  onSubmit: (formData: TContactForm, onReset: () => void) => void;
};

export const ContactForm: FC<ContactFormProps> = ({ formId, defaultValues, onSubmit }) => {
  const form = useForm<TContactForm>({ resolver: zodResolver(contactFormSchema), defaultValues });
  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

  return (
    <Form {...form}>
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <FieldForm control={form.control} name="name" label="Contact Name">
          {({ field }) => <Input {...field} placeholder="@: John Doe" />}
        </FieldForm>

        <FieldForm control={form.control} name="phone" label="Phone Number">
          {({ field }) => <Input {...field} placeholder="@: +8801234567890" />}
        </FieldForm>

        <FieldForm control={form.control} name="address" label="Address">
          {({ field }) => <Textarea {...field} placeholder="@: 123 Main Street" />}
        </FieldForm>
      </form>
    </Form>
  );
};
