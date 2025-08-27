"use client";

import { FC } from "react";
import { TooltipContainer } from "@/components/shared";
import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { usePopupState } from "@/lib/hooks";
import { queryKeys } from "@/lib/query.keys";
import { PencilLine } from "lucide-react";
import { RegularTransactionForm } from "./regular-transaction-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRegularTransactionApi } from "../transaction.api";
import { TRegularTransactionFormData } from "../transaction.schema";
import { TTransaction } from "@/server/db/schema";

type UpdateRegularTransactionProps = Pick<TTransaction, "id" | "amount" | "type" | "categoryId" | "walletId" | "note" | "date">;

export const UpdateRegularTransaction: FC<UpdateRegularTransactionProps> = ({ id, walletId, ...props }) => {
  const mutationKey = `update-${queryKeys.transaction.regular}-${id}`;
  const queryClient = useQueryClient();
  const { open, onOpenChange } = usePopupState();

  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: updateRegularTransactionApi });

  const handleUpdateRegularTransaction = (formData: TRegularTransactionFormData, onReset: () => void) => {
    mutate(
      {
        id: id,
        date: formData.date,
        categoryId: formData.categoryId,
        note: formData.note,
      },
      {
        onSuccess: () => {
          onReset();
          queryClient.invalidateQueries({ queryKey: [queryKeys.transaction.regular] });
          queryClient.invalidateQueries({ queryKey: [queryKeys.category] });
          onOpenChange(false);
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
          defaultValues={{
            ...props,
            categoryId: props.categoryId ?? undefined,
            note: props.note ?? undefined,
            date: new Date(props.date),
            walletId: walletId,
            amount: Number(props.amount),
            type: props.type as TRegularTransactionFormData["type"],
          }}
        />
      </FormDialog>
    </>
  );
};
