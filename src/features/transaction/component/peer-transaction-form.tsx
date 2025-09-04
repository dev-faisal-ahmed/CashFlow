"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { TPeerTransactionFormData, transactionSchema } from "../transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { CommonSelect, FieldForm } from "@/components/shared/form";
import { Input } from "@/components/ui/input";
import { ETransactionType } from "@/server/db/schema";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query.keys";
import { getAllContactListApi } from "@/features/contact/contact.api";
import { WalletSelection } from "@/features/wallet/components";
import { DatePicker } from "@/components/shared/form/date-picker";
import { Textarea } from "@/components/ui/textarea";

type PeerTransactionFormProps = {
  formId: string;
  defaultValues?: Partial<TPeerTransactionFormData>;
  onSubmit: (data: TPeerTransactionFormData, onReset: () => void) => void;
  mode: "add-form-contact" | "add-form-transaction" | "edit";
};

const transactionTypeOptions = [
  { label: "Borrow", value: ETransactionType.borrow },
  { label: "Lend", value: ETransactionType.lend },
];

export const PeerTransactionForm: FC<PeerTransactionFormProps> = ({ formId, defaultValues, onSubmit, mode }) => {
  const form = useForm<TPeerTransactionFormData>({ resolver: zodResolver(transactionSchema.peerTransaction), defaultValues });
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

          <FieldForm control={form.control} name="type" label="Type">
            {({ field: { value, onChange } }) => (
              <CommonSelect options={transactionTypeOptions} value={value} onChange={onChange} disabled={mode === "edit"} />
            )}
          </FieldForm>
        </div>

        <FieldForm control={form.control} name="contactId" label="Contact">
          {({ field: { value, onChange } }) => (
            <ContactSelection value={value} onChange={onChange} disabled={mode === "add-form-contact"} />
          )}
        </FieldForm>

        <FieldForm control={form.control} name="walletId" label="Wallet">
          {({ field: { value, onChange } }) => (
            <WalletSelection
              value={value}
              onChange={onChange}
              {...(type === ETransactionType.borrow && { isSaving: false })}
              disabled={mode === "edit"}
              placeholder="Select wallet"
            />
          )}
        </FieldForm>

        <FieldForm control={form.control} name="date" label="Date">
          {({ field: { value, onChange } }) => <DatePicker value={value} onChange={onChange} />}
        </FieldForm>

        <FieldForm control={form.control} name="note" label="Note">
          {({ field: { value, onChange } }) => <Textarea value={value ?? ""} onChange={onChange} />}
        </FieldForm>
      </form>
    </Form>
  );
};

type ContactSelectionProps = {
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

const ContactSelection = ({ value, onChange, disabled }: ContactSelectionProps) => {
  const { data: contacts } = useQuery({
    queryKey: [queryKeys.contact, { for: "all-contact-list" }],
    queryFn: getAllContactListApi,
    select: (res) => res.data.map(({ id, name }) => ({ label: name, value: id.toString() })),
  });

  return (
    <CommonSelect
      options={contacts ?? []}
      value={value?.toString() ?? ""}
      onChange={(value) => onChange(Number(value))}
      disabled={disabled}
    />
  );
};
