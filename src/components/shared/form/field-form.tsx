"use client";

import { Label } from "@/components/ui/label";
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";

type FieldFormProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = Omit<
  ControllerProps<TFieldValues, TName>,
  "render"
> & {
  label?: string;
  description?: string;
  showMessage?: boolean;
  children: ControllerProps<TFieldValues, TName>["render"];
  formItemClassName?: string;
};

export const FieldForm = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  label,
  description,
  children,
  formItemClassName,
  showMessage = true,
  ...props
}: FieldFormProps<TFieldValues, TName>) => (
  <FormField
    {...props}
    render={(filedProps) => (
      <FormItem className={formItemClassName}>
        {label && <Label className="text-muted-foreground font-semibold">{label}</Label>}
        <FormControl>{children(filedProps)}</FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        {showMessage && <FormMessage />}
      </FormItem>
    )}
  />
);
