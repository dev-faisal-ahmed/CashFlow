"use client";

import { FC } from "react";
import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { SendHorizontalIcon } from "lucide-react";
import { queryKeys } from "@/lib/query.keys";
import { TTransferTransactionFormData } from "@/features/transaction/transaction.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePopupState } from "@/lib/hooks";
import { createTransferTransactionApi } from "@/features/transaction/transaction.api";
import { TransferTransactionForm } from "./transfer-transaction-form";
import { toast } from "sonner";

type CreateTransferTransactionProps = {
  walletId: number;
  balance: number;
  onSuccess?: () => void;
};

export const CreateTransferTransaction: FC<CreateTransferTransactionProps> = ({ walletId, balance, onSuccess }) => {
  const mutationKey = `transfer-${queryKeys.wallet}-${walletId}`;
  const queryClient = useQueryClient();
  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({
    mutationKey: [mutationKey],
    mutationFn: createTransferTransactionApi,
  });

  const handleTransfer = (formData: TTransferTransactionFormData, onReset: () => void) => {
    if (formData.amount > balance) {
      toast.error("Insufficient balance");
      return;
    }

    mutate(
      {
        amount: formData.amount,
        senderWalletId: walletId,
        receiverWalletId: formData.destinationWalletId,
        ...(formData.description && { description: formData.description }),
        ...(formData.fee && { fee: formData.fee }),
        ...(formData.description && { description: formData.description }),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKeys.wallet] });
          queryClient.invalidateQueries({ queryKey: [queryKeys.transaction.transfer] });
          onReset();
          onOpenChange(false);
          onSuccess?.();
        },
      },
    );
  };

  return (
    <>
      <Button variant="ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <SendHorizontalIcon /> Transfer
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={mutationKey}
        title="Transfer Money"
        description="Provide necessary information to transfer money"
      >
        <TransferTransactionForm formId={mutationKey} sourceWalletId={walletId} onSubmit={handleTransfer} />
      </FormDialog>
    </>
  );
};
