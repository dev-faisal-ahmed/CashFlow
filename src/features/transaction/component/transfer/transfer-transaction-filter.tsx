"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { TTransferTransactionFilterFormData } from "../../transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../../transaction.schema";
import { Form } from "@/components/ui/form";
import { DatePicker, FieldForm, FormSheet } from "@/components/shared/form";
import { usePopupState } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { TooltipContainer } from "@/components/shared";
import { queryKeys } from "@/lib/query.keys";
import { FunnelIcon } from "lucide-react";

type TransferTransactionFilterProps = {
  filter?: TTransferTransactionFilterFormData;
  onFilterChange: (data: TTransferTransactionFilterFormData) => void;
};

const formId = `${queryKeys.transaction.transfer}-filter`;

export const TransferTransactionFilter: FC<TransferTransactionFilterProps> = ({ filter, onFilterChange }) => {
  const { open, onOpenChange } = usePopupState();

  return (
    <>
      <TooltipContainer label="Filter">
        <Button variant="outline" onClick={() => onOpenChange(true)}>
          <FunnelIcon className="size-4" />
        </Button>
      </TooltipContainer>

      <FormSheet formId={formId} title="Filter" open={open} onOpenChange={onOpenChange}>
        <TransferTransactionFilterForm filter={filter} onFilterChange={onFilterChange} onOpenChange={onOpenChange} />
      </FormSheet>
    </>
  );
};

type TransferTransactionFilterFormProps = TransferTransactionFilterProps & {
  onOpenChange: (open: boolean) => void;
};

const TransferTransactionFilterForm: FC<TransferTransactionFilterFormProps> = ({ filter, onFilterChange, onOpenChange }) => {
  const form = useForm<TTransferTransactionFilterFormData>({
    resolver: zodResolver(transactionSchema.transferTransactionFilterForm),
    defaultValues: filter,
  });

  const handleSubmit = form.handleSubmit((formData) => {
    onFilterChange(formData);
    onOpenChange(false);
  });

  return (
    <Form {...form}>
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
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
