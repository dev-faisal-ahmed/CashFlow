"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TRegularTransactionFormData } from "../transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../transaction.schema";
import { CommonSelect, FieldForm } from "@/components/shared/form";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";
import { WalletSelection } from "@/features/wallet/components";
import { DatePicker } from "@/components/shared/form/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ECategoryType, ETransactionType } from "@/server/db/schema";
import { getCategoryListApi } from "@/features/category/category.api";

// Main : Transaction Form
type RegularTransactionFormProps = {
  formId: string;
  defaultValues: Partial<TRegularTransactionFormData>;
  onSubmit: (formData: TRegularTransactionFormData, onReset: () => void) => void;
  mode: "add" | "edit";
};

const natureOptions = [
  { label: "Income", value: ETransactionType.income },
  { label: "Expense", value: ETransactionType.expense },
];

export const RegularTransactionForm: FC<RegularTransactionFormProps> = ({ formId, defaultValues, onSubmit, mode }) => {
  const form = useForm<TRegularTransactionFormData>({
    resolver: zodResolver(transactionSchema.regularTransaction),
    defaultValues,
  });

  const type = form.watch("type");
  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

  return (
    <Form {...form}>
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FieldForm control={form.control} name="amount" label="Amount">
            {({ field: { value, onChange } }) => (
              <Input
                value={value ?? ""}
                onChange={(e) => onChange(Number(e.target.value))}
                placeholder="@: 100"
                disabled={mode === "edit"}
              />
            )}
          </FieldForm>

          <FieldForm control={form.control} name="type" label="Income/Expense">
            {({ field: { value, onChange } }) => (
              <CommonSelect options={natureOptions} value={value} onChange={onChange} disabled={mode === "edit"} />
            )}
          </FieldForm>
        </div>

        <FieldForm control={form.control} name="categoryId" label="Source">
          {({ field: { value, onChange } }) => (
            <CategorySelection
              value={value ?? 0}
              onChange={onChange}
              type={type === ETransactionType.income ? ECategoryType.income : ECategoryType.expense}
            />
          )}
        </FieldForm>

        <FieldForm control={form.control} name="walletId" label="Wallet">
          {({ field: { value, onChange } }) => (
            <WalletSelection
              value={value}
              onChange={onChange}
              disabled={mode === "edit"}
              {...(type === ETransactionType.expense && { isSaving: false })}
            />
          )}
        </FieldForm>

        <FieldForm control={form.control} name="date" label="Date">
          {({ field: { value, onChange } }) => <DatePicker value={value} onChange={onChange} />}
        </FieldForm>

        <FieldForm control={form.control} name="description" label="Description">
          {({ field }) => <Textarea {...field} placeholder="@: Description" />}
        </FieldForm>
      </form>
    </Form>
  );
};

type CategorySelectionProps = {
  value: number;
  onChange: (value: number) => void;
  type?: ECategoryType;
};

export const CategorySelection: FC<CategorySelectionProps> = ({ value, onChange, type }) => {
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.category, "for-transaction"],
    queryFn: getCategoryListApi,
  });

  const categories =
    typeof type !== undefined
      ? data?.filter((category) => category.type === type)?.map(({ id, name }) => ({ label: name, value: id.toString() }))
      : data?.map(({ id, name }) => ({ label: name, value: id.toString() }));

  if (isLoading) return <Skeleton className="h-input" />;

  return <CommonSelect value={value?.toString() ?? ""} onChange={(value) => onChange(Number(value))} options={categories ?? []} />;
};
