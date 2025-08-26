"use client";

import { FC } from "react";
import { Form } from "@/components/ui/form";
import { CommonSelect, FieldForm } from "@/components/shared/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categorySchema, TCategoryFormData } from "../category.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { EBudgetInterval, ECategoryType } from "@/server/db/schema";

type CategoryFormProps = {
  formId: string;
  mode: "add" | "update";
  defaultValues: TCategoryFormData;
  onSubmit: (formData: TCategoryFormData, onReset: () => void) => void;
};

const intervalOptions: { label: string; value: EBudgetInterval }[] = [
  { label: "Monthly", value: EBudgetInterval.monthly },
  { label: "Weekly", value: EBudgetInterval.weekly },
  { label: "Yearly", value: EBudgetInterval.yearly },
];

const typeOptions: { label: string; value: ECategoryType }[] = [
  { label: "Income", value: ECategoryType.income },
  { label: "Expense", value: ECategoryType.expense },
  { label: "Both", value: ECategoryType.both },
];

export const CategoryForm: FC<CategoryFormProps> = ({ mode, formId, defaultValues, onSubmit }) => {
  const form = useForm<TCategoryFormData>({ resolver: zodResolver(categorySchema.category), defaultValues });
  const addBudget = form.watch("addBudget");
  const type = form.watch("type");

  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

  return (
    <Form {...form}>
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <FieldForm control={form.control} name="name" label="Category Name">
          {({ field }) => <Input {...field} placeholder="@: Salary" />}
        </FieldForm>

        <FieldForm control={form.control} name="type" label="Category Type">
          {({ field }) => <CommonSelect disabled={mode === "update"} options={typeOptions} {...field} />}
        </FieldForm>

        {addBudget && (
          <>
            <FieldForm control={form.control} name="budget.amount" label="Budget Amount">
              {({ field: { value, onChange } }) => (
                <Input value={value ?? ""} onChange={(e) => onChange(Number(e.target.value))} placeholder="@: 5000" />
              )}
            </FieldForm>

            <FieldForm control={form.control} name="budget.interval" label="Budget Interval">
              {({ field: { value, onChange } }) => <CommonSelect options={intervalOptions} value={value} onChange={onChange} />}
            </FieldForm>
          </>
        )}

        {type === ECategoryType.expense && (
          <FieldForm control={form.control} name="addBudget">
            {({ field: { value, onChange } }) => (
              <div className="flex items-center gap-2">
                <Switch id="add-budget" checked={!!value} onCheckedChange={onChange} />
                <Label htmlFor="add-budget" className="text-muted-foreground cursor-pointer">
                  Add Budget Info?
                </Label>
              </div>
            )}
          </FieldForm>
        )}
      </form>
    </Form>
  );
};
