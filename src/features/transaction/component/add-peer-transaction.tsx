"use client";

import { FC } from "react";
import { TooltipContainer } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { usePopupState } from "@/lib/hooks";
import { useMutation } from "@tanstack/react-query";
import { PlugIcon, PlusIcon } from "lucide-react";
import { createPeerTransactionApi } from "../transaction.api";
import { queryKeys } from "@/lib/query.keys";
import { useQueryClient } from "@tanstack/react-query";
import { TPeerTransactionFormData } from "../transaction.schema";
import { FormDialog } from "@/components/shared/form";
import { PeerTransactionForm } from "./peer-transaction-form";

// consts
const mutationKey = `add-${queryKeys.transaction.peer}`;

export const AddPeerTransactionFromContact: FC<{ contactId: number }> = ({ contactId }) => {
  const { open, onOpenChange, handleCreatePeerTransaction } = useAddPeerTransaction();

  return (
    <>
      <TooltipContainer label="Add Peer Transaction">
        <Button variant="outline" size="icon" onClick={() => onOpenChange(true)}>
          <PlugIcon className="size-4" />
        </Button>
      </TooltipContainer>

      <FormDialog formId={mutationKey} title="Add Peer Transaction" open={open} onOpenChange={onOpenChange}>
        <PeerTransactionForm
          formId={mutationKey}
          mode="add-form-contact"
          onSubmit={handleCreatePeerTransaction}
          defaultValues={{ contactId: contactId, date: new Date() }}
        />
      </FormDialog>
    </>
  );
};

export const AddPeerTransactionFromTransaction = () => {
  const { open, onOpenChange, handleCreatePeerTransaction } = useAddPeerTransaction();

  return (
    <>
      <Button onClick={() => onOpenChange(true)}>
        <PlusIcon className="size-4" />
        <span className="hidden md:block">Add Peer Transaction</span>
      </Button>

      <FormDialog formId={mutationKey} title="Add Peer Transaction" open={open} onOpenChange={onOpenChange}>
        <PeerTransactionForm
          formId={mutationKey}
          mode="add-form-transaction"
          onSubmit={handleCreatePeerTransaction}
          defaultValues={{ date: new Date() }}
        />
      </FormDialog>
    </>
  );
};

// Hook
const useAddPeerTransaction = () => {
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: createPeerTransactionApi });

  const handleCreatePeerTransaction = (formData: TPeerTransactionFormData, onReset: () => void) => {
    mutate(
      { ...formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKeys.transaction.peer] });
          queryClient.invalidateQueries({ queryKey: [queryKeys.contact] });
          queryClient.invalidateQueries({ queryKey: [queryKeys.wallet] });
          onReset();
          onOpenChange(false);
        },
      },
    );
  };

  return {
    open,
    onOpenChange,
    handleCreatePeerTransaction,
  };
};
