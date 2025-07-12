import { FC } from "react";
import { TSourceForm } from "../source-type";
import { useForm } from "react-hook-form";
import { sourceSchema } from "../source-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { CommonSelect, FieldForm } from "@/components/shared/form";
import { Input } from "@/components/ui/input";
import { TBudgetInterval, TSourceType } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type SourceFormProps = {
  formId: string;
  mode: "add" | "update";
  defaultValues: TSourceForm;
  onSubmit: (formData: TSourceForm, onReset: () => void) => void;
};

const intervalOptions: { label: string; value: TBudgetInterval }[] = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Yearly", value: "YEARLY" },
];

const typeOptions: { label: string; value: TSourceType }[] = [
  { label: "Income", value: "INCOME" },
  { label: "Expense", value: "EXPENSE" },
];

export const SourceForm: FC<SourceFormProps> = ({ mode, formId, defaultValues, onSubmit }) => {
  const form = useForm<TSourceForm>({ resolver: zodResolver(sourceSchema), defaultValues });
  const addBudget = form.watch("addBudget");
  const type = form.watch("type");

  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

  console.log(defaultValues);

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
        {type === "EXPENSE" && (
          <FieldForm control={form.control} name="addBudget">
            {({ field: { value, onChange } }) => (
              <div className="flex items-center gap-2">
                <Checkbox id="addBudget" checked={!!value} onCheckedChange={onChange} className="cursor-pointer" />
                <Label htmlFor="addBudget" className="text-muted-foreground cursor-pointer">
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
