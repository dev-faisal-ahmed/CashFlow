"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { TPeerTransactionFilterFormData } from "../../transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../../transaction.schema";
import { Form } from "@/components/ui/form";
import { CommonSelect, DatePicker, FieldForm, FormSheet } from "@/components/shared/form";
import { ETransactionType } from "@/server/db/schema";
import { usePopupState } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { TooltipContainer } from "@/components/shared";
import { queryKeys } from "@/lib/query.keys";
import { FunnelIcon } from "lucide-react";

type PeerTransactionFilterProps = {
  filter?: TPeerTransactionFilterFormData;
  onFilterChange: (data: TPeerTransactionFilterFormData) => void;
};

const formId = `${queryKeys.transaction.peer}-filter`;

export const PeerTransactionFilter: FC<PeerTransactionFilterProps> = ({ filter, onFilterChange }) => {
  const { open, onOpenChange } = usePopupState();

  return (
    <>
      <TooltipContainer label="Filter">
        <Button variant="outline" onClick={() => onOpenChange(true)}>
          <FunnelIcon className="size-4" />
        </Button>
      </TooltipContainer>

      <FormSheet formId={formId} title="Filter" open={open} onOpenChange={onOpenChange}>
        <PeerTransactionFilterForm filter={filter} onFilterChange={onFilterChange} onOpenChange={onOpenChange} />
      </FormSheet>
    </>
  );
};

type PeerTransactionFilterFormProps = PeerTransactionFilterProps & {
  onOpenChange: (open: boolean) => void;
};

const typeOptions = [
  { label: "Lend", value: ETransactionType.lend },
  { label: "Borrow", value: ETransactionType.borrow },
];

const PeerTransactionFilterForm: FC<PeerTransactionFilterFormProps> = ({ filter, onFilterChange, onOpenChange }) => {
  const form = useForm<TPeerTransactionFilterFormData>({
    resolver: zodResolver(transactionSchema.peerTransactionFilterForm),
    defaultValues: filter,
  });

  const handleSubmit = form.handleSubmit((formData) => {
    onFilterChange(formData);
    onOpenChange(false);
  });

  return (
    <Form {...form}>
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <FieldForm control={form.control} name="type" label="Type">
          {({ field: { value, onChange } }) => <CommonSelect options={typeOptions} value={value ?? ""} onChange={onChange} />}
        </FieldForm>

        <FieldForm control={form.control} name="startDate" label="Start Date">
          {({ field: { value, onChange } }) => <DatePicker value={value} onChange={onChange} />}
        </FieldForm>

        <FieldForm control={form.control} name="endDate" label="End Date">
          {({ field: { value, onChange } }) => <DatePicker value={value} onChange={onChange} />}
        </FieldForm>
      </form>
    </Form>
  );
};
