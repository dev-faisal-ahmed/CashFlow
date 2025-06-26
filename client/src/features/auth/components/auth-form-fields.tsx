import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { TAuthForm } from "../auth-types";
import { FieldForm } from "@/components/shared/form/field-form";
import { Input } from "@/components/ui/input";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";
import { PasswordInput } from "@/components/shared/form/password-input";

type AuthFormFieldsProps = { formType: "signup" | "login" };

export const AuthFormFields: FC<AuthFormFieldsProps> = ({ formType }) => {
  const { control } = useFormContext<TAuthForm>();

  return (
    <>
      {formType === "signup" && (
        <FieldForm control={control} name="name" label="Name">
          {({ field }) => (
            <div className="relative">
              <UserIcon className="text-muted-foreground absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2" />
              <Input {...field} placeholder="@: John doe" className="pl-10" />
            </div>
          )}
        </FieldForm>
      )}

      <FieldForm control={control} name="email" label="Email">
        {({ field }) => (
          <div className="relative">
            <MailIcon className="text-muted-foreground absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2" />
            <Input {...field} type="email" placeholder="@: john@example.com" className="pl-10" />
          </div>
        )}
      </FieldForm>

      <FieldForm control={control} name="password" label="Password">
        {({ field }) => (
          <div className="relative">
            <LockIcon className="text-muted-foreground absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2" />
            <PasswordInput {...field} type="email" placeholder="@: john@example.com" className="pl-10" />
          </div>
        )}
      </FieldForm>

      {formType === "signup" && (
        <FieldForm control={control} name="confirmPassword" label="Confirm Password">
          {({ field }) => (
            <div className="relative">
              <LockIcon className="text-muted-foreground absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2" />
              <PasswordInput {...field} type="email" placeholder="@: john@example.com" className="pl-10" />
            </div>
          )}
        </FieldForm>
      )}
    </>
  );
};
