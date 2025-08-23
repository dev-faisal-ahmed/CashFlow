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
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";
import { getSourceListWithBasicInfoApi } from "@/features/source/source.api";
import { WalletSelection } from "@/features/wallet/components";
import { DatePicker } from "@/components/shared/form/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { ESourceType } from "@/server/modules/source/source.interface";
import { Skeleton } from "@/components/ui/skeleton";

// Main : Transaction Form
type TransactionFormProps = {
  formId: string;
  defaultValues: Partial<TRegularTransactionFormData>;
  onSubmit: (formData: TRegularTransactionFormData, onReset: () => void) => void;
};

const natureOptions = [
  { label: "Income", value: ETransactionNature.income },
  { label: "Expense", value: ETransactionNature.expense },
];

export const TransactionForm: FC<TransactionFormProps> = ({ formId, defaultValues, onSubmit }) => {
  const form = useForm<TRegularTransactionFormData>({
    resolver: zodResolver(transactionSchema.regularTransaction),
    defaultValues,
  });

  const nature = form.watch("nature");

  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

  return (
    <Form {...form}>
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FieldForm control={form.control} name="amount" label="Amount">
            {({ field: { value, onChange } }) => (
              <Input value={value ?? ""} onChange={(e) => onChange(Number(e.target.value))} placeholder="@: 100" />
            )}
          </FieldForm>

          <FieldForm control={form.control} name="nature" label="Income/Expense">
            {({ field: { value, onChange } }) => <CommonSelect options={natureOptions} value={value} onChange={onChange} />}
          </FieldForm>
        </div>

        <FieldForm control={form.control} name="sourceId" label="Source">
          {({ field: { value, onChange } }) => (
            <SourceSelection
              value={value}
              onChange={onChange}
              type={nature === ETransactionNature.income ? ESourceType.income : ESourceType.expense}
            />
          )}
        </FieldForm>

        <FieldForm control={form.control} name="walletId" label="Wallet">
          {({ field: { value, onChange } }) => (
            <WalletSelection value={value} onChange={onChange} {...(nature === ETransactionNature.expense && { isSaving: false })} />
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

type SourceSelectionProps = {
  value: string;
  onChange: (value: string) => void;
  type?: ESourceType;
};

export const SourceSelection: FC<SourceSelectionProps> = ({ value, onChange, type }) => {
  const { data: sourceList, isLoading } = useQuery({
    queryKey: [queryKeys.source, "for-transaction", { type }],
    queryFn: () => getSourceListWithBasicInfoApi({ ...(type && { type }) }),
    select: (res) => res.map(({ _id, name }) => ({ label: name, value: _id })),
  });

  if (isLoading) return <Skeleton className="h-input" />;

  return <CommonSelect value={value} onChange={onChange} options={sourceList ?? []} />;
};
