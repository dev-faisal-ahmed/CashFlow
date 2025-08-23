"use client";

import { FC } from "react";
import { TooltipContainer } from "@/components/shared";
import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { usePopupState } from "@/lib/hooks";
import { queryKeys } from "@/lib/query.keys";
import { IRegularTransaction } from "@/server/modules/transaction/transaction.interface";
import { PencilLine } from "lucide-react";
import { RegularTransactionForm } from "./regular-transaction-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRegularTransactionApi } from "../transaction.api";
import { TRegularTransactionFormData } from "../transaction.schema";

type UpdateRegularTransactionProps = Pick<IRegularTransaction, "amount" | "walletId" | "nature" | "sourceId" | "description" | "date"> & {
  _id: string;
};

export const UpdateRegularTransaction: FC<UpdateRegularTransactionProps> = ({ _id, ...props }) => {
  const mutationKey = `update-${queryKeys.transaction}-${_id}`;
  const queryClient = useQueryClient();
  const { open, onOpenChange } = usePopupState();

  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: updateRegularTransactionApi });

  const handleUpdateRegularTransaction = (formData: TRegularTransactionFormData, onReset: () => void) => {
    mutate(
      {
        id: _id,
        date: formData.date,
        sourceId: formData.sourceId,
        description: formData.description,
      },
      {
        onSuccess: () => {
          onReset();
          queryClient.invalidateQueries({ queryKey: [queryKeys.transaction] });
          queryClient.invalidateQueries({ queryKey: [queryKeys.source] });
        },
      },
    );
  };

  return (
    <>
      <TooltipContainer label="Update Transaction">
        <Button variant="outline" size="icon" onClick={() => onOpenChange(true)}>
          <PencilLine className="size-4" />
        </Button>
      </TooltipContainer>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={mutationKey}
        title="Add New Transaction"
        description="Fill up the form to create a new transaction"
      >
        <RegularTransactionForm
          mode="edit"
          formId={mutationKey}
          onSubmit={handleUpdateRegularTransaction}
          defaultValues={{ ...props, sourceId: props.sourceId.toString(), walletId: props.walletId.toString() }}
        />
      </FormDialog>
    </>
  );
};
