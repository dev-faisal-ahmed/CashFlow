"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TRegularTransactionFormData } from "../transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../transaction.schema";
import { CommonSelect, FieldForm } from "@/components/shared/form";
import { ETransactionNature } from "@/server/modules/transaction/transaction.interface";

// Main : Transaction Form
type TransactionFormProps = {
  defaultValues: TRegularTransactionFormData;
  onSubmit: (formData: TRegularTransactionFormData, onReset: () => void) => void;
};

const natureOptions = [
  { label: "Income", value: ETransactionNature.income },
  { label: "Expense", value: ETransactionNature.expense },
];

export const TransactionForm: FC<TransactionFormProps> = ({ defaultValues, onSubmit }) => {
  const form = useForm<TRegularTransactionFormData>({
    resolver: zodResolver(transactionSchema.regularTransaction),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <FieldForm control={form.control} name="amount" label="Amount">
            {({ field: { value, onChange } }) => (
              <Input value={value ?? ""} onChange={(e) => onChange(Number(e.target.value))} placeholder="@: 100" />
            )}
          </FieldForm>

          <FieldForm control={form.control} name="nature" label="Income/Expense">
            {({ field: { value, onChange } }) => <CommonSelect options={natureOptions} value={value} onChange={onChange} />}
          </FieldForm>
        </div>
      </form>
    </Form>
  );
};
