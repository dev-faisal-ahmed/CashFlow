import { useFormContext } from "react-hook-form";
import { TSourceForm } from "../source-type";
import { CommonSelect, FieldForm } from "@/components/shared/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TBudgetInterval, TSourceType } from "@/lib/types";

const intervalOptions: { label: string; value: TBudgetInterval }[] = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Yearly", value: "YEARLY" },
];

const typeOptions: { label: string; value: TSourceType }[] = [
  { label: "Income", value: "INCOME" },
  { label: "Expense", value: "EXPENSE" },
];

export const SourceFormFields = () => {
  const { control, watch } = useFormContext<TSourceForm>();

  // Watch if `addBudget` is enabled to conditionally render budget fields
  const addBudget = watch("addBudget");
  const type = watch("type");

  return (
    <>
      {/* Source Name Field */}
      <FieldForm control={control} name="name" label="Source Name">
        {({ field }) => <Input {...field} placeholder="@: Salary" />}
      </FieldForm>

      {/* Source Type Field */}
      <FieldForm control={control} name="type" label="Source Type">
        {({ field }) => <CommonSelect options={typeOptions} {...field} />}
      </FieldForm>

      {/* Budget Fields (conditionally shown) */}
      {addBudget && (
        <>
          <FieldForm control={control} name="budget.amount" label="Budget Amount">
            {({ field: { value, onChange } }) => (
              <Input value={value ?? ""} onChange={(e) => onChange(Number(e.target.value))} placeholder="@: 5000" />
            )}
          </FieldForm>

          <FieldForm control={control} name="budget.interval" label="Budget Interval">
            {({ field: { value, onChange } }) => <CommonSelect options={intervalOptions} value={value} onChange={onChange} />}
          </FieldForm>
        </>
      )}

      {/* Add Budget Checkbox */}
      {type === "EXPENSE" && (
        <FieldForm control={control} name="addBudget">
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
    </>
  );
};
