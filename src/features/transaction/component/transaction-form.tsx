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

// Main : Transaction Form
type TransactionFormProps = {
  defaultValues: Partial<TRegularTransactionFormData>;
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
          {({ field: { value, onChange } }) => <SourceListSelect value={value} onChange={onChange} />}
        </FieldForm>

        <FieldForm control={form.control} name="walletId" label="Wallet">
          {({ field: { value, onChange } }) => <WalletSelection value={value} onChange={onChange} />}
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

type SourceListSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SourceListSelect: FC<SourceListSelectProps> = ({ value, onChange }) => {
  const { data: sourceList } = useQuery({
    queryKey: [queryKeys.source, "for-transaction"],
    queryFn: getSourceListWithBasicInfoApi,
    select: (res) => res.map(({ _id, name }) => ({ label: name, value: _id })),
  });

  return <CommonSelect value={value} onChange={onChange} options={sourceList ?? []} disabled={!sourceList?.length} />;
};
