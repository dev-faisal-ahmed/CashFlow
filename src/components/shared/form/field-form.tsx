"use client";

import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { ComponentProps } from "react";
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";

type FieldFormProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = Omit<
  ControllerProps<TFieldValues, TName>,
  "render"
> & {
  label?: string;
  description?: string;
  showMessage?: boolean;
  children: ControllerProps<TFieldValues, TName>["render"];
  formItemProps?: ComponentProps<"div">;
};

export const FieldForm = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  label,
  description,
  children,
  formItemProps,
  showMessage = true,
  ...props
}: FieldFormProps<TFieldValues, TName>) => (
  <FormField
    {...props}
    render={(filedProps) => (
      <FormItem {...formItemProps}>
        {label && <Label className="text-muted-foreground font-semibold">{label}</Label>}
        <FormControl>{children(filedProps)}</FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        {showMessage && <FormMessage />}
      </FormItem>
    )}
  />
);
