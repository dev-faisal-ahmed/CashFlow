"use client";

import { FC } from "react";
import { TooltipContainer } from "@/components/shared";
import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { usePopupState } from "@/lib/hooks";
import { queryKeys } from "@/lib/query.keys";
import { PencilLine } from "lucide-react";
import { PeerTransactionForm } from "./peer-transaction-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePeerTransactionApi } from "../transaction.api";
import { TPeerTransactionFormData } from "../transaction.schema";
import { TTransaction } from "@/server/db/schema";

type UpdatePeerTransactionProps = Pick<TTransaction, "id" | "amount" | "type" | "contactId" | "walletId" | "note" | "date">;

export const UpdatePeerTransaction: FC<UpdatePeerTransactionProps> = ({ id, walletId, ...props }) => {
  const mutationKey = `update-${queryKeys.transaction.peer}-${id}`;
  const queryClient = useQueryClient();
  const { open, onOpenChange } = usePopupState();

  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: updatePeerTransactionApi });

  const handleUpdatePeerTransaction = (formData: TPeerTransactionFormData, onReset: () => void) => {
    mutate(
      {
        id: id,
        date: formData.date,
        contactId: formData.contactId,
        note: formData.note,
      },
      {
        onSuccess: () => {
          onReset();
          queryClient.invalidateQueries({ queryKey: [queryKeys.transaction.peer] });
          queryClient.invalidateQueries({ queryKey: [queryKeys.contact] });
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
        title="Update Peer Transaction"
        description="Fill up the form to update the transaction"
      >
        <PeerTransactionForm
          mode="edit"
          formId={mutationKey}
          onSubmit={handleUpdatePeerTransaction}
          defaultValues={{
            ...props,
            contactId: props.contactId ?? undefined,
            note: props.note ?? undefined,
            date: new Date(props.date),
            walletId: walletId,
            amount: Number(props.amount),
            type: props.type as TPeerTransactionFormData["type"],
          }}
        />
      </FormDialog>
    </>
  );
};
