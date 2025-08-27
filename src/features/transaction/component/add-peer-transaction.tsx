"use client";

import { useForm } from "react-hook-form";
import { TPeerTransactionFormData, transactionSchema } from "../transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { CommonSelect, FieldForm } from "@/components/shared/form";
import { Input } from "@/components/ui/input";
import { ETransactionType } from "@/server/db/schema";

type AddPeerTransactionProps = {
  formId: string;
  defaultValues?: Partial<TPeerTransactionFormData>;
  onSubmit: (data: TPeerTransactionFormData, onReset: () => void) => void;
};

const transactionTypeOptions = [
  { label: "Borrow", value: ETransactionType.borrow },
  { label: "Income", value: ETransactionType.income },
];

export const AddPeerTransaction = ({ formId, defaultValues, onSubmit }: AddPeerTransactionProps) => {
  const form = useForm<TPeerTransactionFormData>({ resolver: zodResolver(transactionSchema.peerTransaction), defaultValues });
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

          <FieldForm control={form.control} name="type" label="Type">
            {({ field: { value, onChange } }) => <CommonSelect options={transactionTypeOptions} value={value} onChange={onChange} />}
          </FieldForm>
        </div>
      </form>
    </Form>
  );
};
