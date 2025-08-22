"use client";

import { FC } from "react";
import { Form } from "@/components/ui/form";
import { CommonSelect, FieldForm } from "@/components/shared/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EBudgetInterval, ESourceType } from "@/server/modules/source/source.interface";
import { sourceSchema, TSourceFormData } from "../source.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";

type SourceFormProps = {
  formId: string;
  mode: "add" | "update";
  defaultValues: TSourceFormData;
  onSubmit: (formData: TSourceFormData, onReset: () => void) => void;
};

const intervalOptions: { label: string; value: EBudgetInterval }[] = [
  { label: "Monthly", value: EBudgetInterval.monthly },
  { label: "Weekly", value: EBudgetInterval.weekly },
  { label: "Yearly", value: EBudgetInterval.yearly },
];

const typeOptions: { label: string; value: ESourceType }[] = [
  { label: "Income", value: ESourceType.income },
  { label: "Expense", value: ESourceType.expense },
  { label: "Both", value: ESourceType.both },
];

export const SourceForm: FC<SourceFormProps> = ({ mode, formId, defaultValues, onSubmit }) => {
  const form = useForm<TSourceFormData>({ resolver: zodResolver(sourceSchema.source), defaultValues });
  const addBudget = form.watch("addBudget");
  const type = form.watch("type");

  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

  return (
    <Form {...form}>
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        {/* Source Name Field */}
        <FieldForm control={form.control} name="name" label="Source Name">
          {({ field }) => <Input {...field} placeholder="@: Salary" />}
        </FieldForm>

        {/* Source Type Field */}
        <FieldForm control={form.control} name="type" label="Source Type">
          {({ field }) => <CommonSelect disabled={mode === "update"} options={typeOptions} {...field} />}
        </FieldForm>

        {/* Budget Fields (conditionally shown) */}
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

        {/* Add Budget Checkbox */}
        {type === ESourceType.expense && (
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
