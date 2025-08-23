"use client";

import { PlusIcon } from "lucide-react";
import { FormDialog } from "@/components/shared/form";
import { Button } from "@/components/ui/button";
import { usePopupState } from "@/lib/hooks";
import { queryKeys } from "@/lib/query.keys";
import { RegularTransactionForm } from "./regular-transaction-form";
import { TRegularTransactionFormData } from "../transaction.schema";
import { ETransactionNature } from "@/server/modules/transaction/transaction.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRegularTransactionApi } from "../transaction.api";

const mutationKey = `add-${queryKeys.transaction}`;

export const AddRegularTransaction = () => {
  const queryClient = useQueryClient();

  const { open, onOpenChange } = usePopupState();
  const { mutate } = useMutation({ mutationKey: [mutationKey], mutationFn: createRegularTransactionApi });

  const handleAddRegularTransaction = (formData: TRegularTransactionFormData, onReset: () => void) => {
    mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.transaction] });
        queryClient.invalidateQueries({ queryKey: [queryKeys.wallet] });
        queryClient.invalidateQueries({ queryKey: [queryKeys.source] });
        onReset();
        onOpenChange(false);
      },
    });
  };

  return (
    <>
      <Button onClick={() => onOpenChange(true)}>
        <PlusIcon className="size-4" /> Add Transaction
      </Button>

      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        formId={mutationKey}
        title="Add New Transaction"
        description="Fill up the form to create a new transaction"
      >
        <RegularTransactionForm
          mode="add"
          formId={mutationKey}
          onSubmit={handleAddRegularTransaction}
          defaultValues={{ date: new Date(), sourceId: "", walletId: "", nature: ETransactionNature.income }}
        />
      </FormDialog>
    </>
  );
};
