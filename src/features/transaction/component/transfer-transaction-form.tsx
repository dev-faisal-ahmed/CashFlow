"use client";

import { FC } from "react";
import { FieldForm } from "@/components/shared/form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TTransferTransactionFormData, transactionSchema } from "../transaction.schema";
import { WalletSelection } from "@/features/wallet/components/wallet-selection";

type TransferTransactionFormProps = {
  formId: string;
  defaultValues?: Partial<TTransferTransactionFormData>;
  sourceWalletId: number;
  onSubmit: (formData: TTransferTransactionFormData, onReset: () => void) => void;
};

export const TransferTransactionForm: FC<TransferTransactionFormProps> = ({ formId, onSubmit, defaultValues, sourceWalletId }) => {
  const form = useForm<TTransferTransactionFormData>({
    resolver: zodResolver(transactionSchema.transferTransaction),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit((formData) => onSubmit(formData, form.reset));

  return (
    <Form {...form}>
      <form id={formId} onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
        <FieldForm control={form.control} name="amount" label="Amount">
          {({ field: { value, onChange } }) => (
            <Input placeholder="@: 100" value={value || ""} onChange={(e) => onChange(Number(e.target.value))} />
          )}
        </FieldForm>

        <FieldForm control={form.control} name="fee" label="Fee">
          {({ field: { value, onChange } }) => (
            <Input placeholder="@: 10" value={value || ""} onChange={(e) => onChange(Number(e.target.value))} />
          )}
        </FieldForm>

        <FieldForm control={form.control} name="destinationWalletId" label="Destination Wallet">
          {({ field: { value, onChange } }) => (
            <WalletSelection
              skipWalletId={String(sourceWalletId)}
              value={value}
              onChange={onChange}
              placeholder="Select destination wallet"
            />
          )}
        </FieldForm>

        <FieldForm control={form.control} name="description" label="Description">
          {({ field }) => <Textarea {...field} placeholder="@: Description" />}
        </FieldForm>
      </form>
    </Form>
  );
};
