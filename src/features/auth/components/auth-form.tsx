"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { authSchema, TLoginFormData, TSignupFormData } from "../auth.schema";
import { FieldForm, PasswordInput } from "@/components/shared/form";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  formId: string;
  formType: "signup" | "login";
  onSubmit: (formData: TAuthFormData, onReset: () => void) => void;
};

export type TAuthFormData = TSignupFormData | TLoginFormData;

const loginDefaultValue = { email: "", password: "" };
const signupDefaultValue = { name: "", email: "", password: "", confirmPassword: "" };

export const AuthForm: FC<AuthFormProps> = ({ formId, formType, onSubmit }) => {
  const schema = formType === "signup" ? authSchema.signup : authSchema.login;
  const defaultValues = formType === "signup" ? signupDefaultValue : loginDefaultValue;
  const form = useForm<TAuthFormData>({ resolver: zodResolver(schema), defaultValues });

  const handleSubmit = form.handleSubmit((formData: TAuthFormData) => onSubmit(formData, form.reset));

  return (
    <Form {...form}>
      <form id={formId} className="space-y-4" onSubmit={handleSubmit}>
        {formType === "signup" && (
          <FieldForm control={form.control} name="name" label="Name">
            {({ field }) => (
              <div className="relative">
                <UserIcon className="text-muted-foreground absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2" />
                <Input {...field} placeholder="@: John doe" className="pl-10" />
              </div>
            )}
          </FieldForm>
        )}

        <FieldForm control={form.control} name="email" label="Email">
          {({ field }) => (
            <div className="relative">
              <MailIcon className="text-muted-foreground absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2" />
              <Input {...field} type="email" placeholder="@: john@example.com" className="pl-10" />
            </div>
          )}
        </FieldForm>

        <FieldForm control={form.control} name="password" label="Password">
          {({ field }) => (
            <div className="relative">
              <LockIcon className="text-muted-foreground absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2" />
              <PasswordInput {...field} placeholder="@: john@example.com" className="pl-10" />
            </div>
          )}
        </FieldForm>

        {formType === "signup" && (
          <FieldForm control={form.control} name="confirmPassword" label="Confirm Password">
            {({ field }) => (
              <div className="relative">
                <LockIcon className="text-muted-foreground absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2" />
                <PasswordInput {...field} placeholder="@: john@example.com" className="pl-10" />
              </div>
            )}
          </FieldForm>
        )}
      </form>
    </Form>
  );
};
